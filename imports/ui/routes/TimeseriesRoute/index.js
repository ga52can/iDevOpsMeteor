import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import Services from '../../../api/services';
import APMData from '../../../api/apm';
import Spans from '../../../api/spans';
import Environments from '../../../api/environments';

import Heading from '../../components/Heading';
import Dropdown from '../../components/Dropdown';
import Chart from '../../components/Chart';

import layout from '../../components/Chart/layout';
import config from '../../components/Chart/config';
import style from '../../components/Chart/style';

import CircularProgress from '@material-ui/core/CircularProgress';

import {
  aggregateTimeseriesDataByGranularity,
  dataGranularityMapping,
  processAPMData,
  processSpanData,
} from './dataProcessing';


const removeEnvironmentFromServiceName = service => {
  const index = service.name.indexOf('-') + 1;
  return service.name.substr(index);
};

const reduceServicesToUniqueSet = services => {
  const uniqueServices = new Set();
  // eslint-disable-next-line
  for (const service of services) {
    const uniqueName = removeEnvironmentFromServiceName(service);
    uniqueServices.add(uniqueName);
  }
  return [...uniqueServices];
};

const getMetricsOfSelectedService = () => ['cpu', 'memory', 'response-time'];

const getEndpointMethods = (serviceName, spans) => {
  // get all spans, find span with span.name = * - servicename - *, map all mvc.controller.method
  if (serviceName === null || serviceName.length === 0) {
    return [];
  }
  const serviceSpans = spans.filter(span => span.name.includes(serviceName) && typeof span.tags !== 'undefined' && span.tags !== null);
  if(serviceSpans.length > 0)
    return [...new Set(serviceSpans.map(span => span.tags.controller_method))];
  return [null];

  //const serviceSpans = spans.filter(span => span.name.includes(serviceName) && typeof span.pointName !== 'undefined');
  //return [...new Set(serviceSpans.map(span => span.endpointName))];
};


class Timeseries extends React.Component {
  state = {
    selectedService: '',
    selectedMetric: '',
    selectedEndpoint: '',
    selectedDataGranularity: '1m',
    metricChartIsSelected: true,
  };

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  // Honestly, I need a better way to check if meteor was already able to
  // provide the necessary environment & service data. I'm not sure if the
  // standard way of doing this is via checking all necessary props during
  // the start of the render function.
  componentWillReceiveProps(nextProps) {
    const { services, spans } = nextProps;
    const { selectedService, selectedEndpoint } = this.state;

    if (!selectedService && services.length > 0 && !selectedEndpoint && spans.length > 0) {
      const defaultService = removeEnvironmentFromServiceName(services[0]);
      const defaultEndpoint = getEndpointMethods(defaultService, spans)[0];
      this.setState({
        selectedService: defaultService,
        selectedMetric: 'cpu',
        selectedEndpoint: defaultEndpoint,
      });
    }
  }

  changeService = service => {
    const { spans } = this.props;
    const endpoints = getEndpointMethods(service, spans);
    this.setState({
      selectedService: service,
      // setting the endpoint is necessary since each service has other endpoints and we don't know them beforehand.
      selectedEndpoint: endpoints[0],
    });
  };

  changeMetric = metric => {
    const metricChartIsSelected = metric !== 'response-time';
    this.setState({
      selectedMetric: metric,
      metricChartIsSelected,
    });
  };

  changeEndpoint = endpoint => {
    this.setState({ selectedEndpoint: endpoint });
  };

  changeDataGranularity = granularity => {
    this.setState({ selectedDataGranularity: granularity });
  };

  render() {
    const { services, apmData, spans, environments } = this.props;
    const {
      selectedService,
      selectedMetric,
      selectedEndpoint,
      selectedDataGranularity,
      metricChartIsSelected,
    } = this.state;

    if (this.props.loadingServiceEnv) {
      return <div style={{position: 'absolute', top: '50%', left: '60%', transform: 'translate(-50%, -50%)' }} > <CircularProgress /> </div>;
    }

    const uniqueServiceNames = reduceServicesToUniqueSet(services);
    const metricsOfSelectedService = getMetricsOfSelectedService();
    const endpointsOfSelectedService = getEndpointMethods(selectedService, spans);

    let timeseriesData = null;
    let endpointDropdownDisabled = true;
    if (metricChartIsSelected) {
      timeseriesData = processAPMData(
        selectedService,
        selectedMetric,
        selectedDataGranularity,
        services,
        apmData,
        environments,
      );
    } else {
      if (endpointsOfSelectedService[0]) {
        endpointDropdownDisabled = false;
      }
      timeseriesData = processSpanData(
        spans,
        selectedService,
        selectedEndpoint,
        environments
      );
    }
    const aggregatedData = aggregateTimeseriesDataByGranularity(
      timeseriesData, selectedDataGranularity
    );

    return (
      <div>
        <div>
          <Heading text="Timeseries"/>
          <form>
            <Dropdown
            onChangeHandler={this.changeService}
            selectedValue={selectedService}
            selectionArray={uniqueServiceNames}
            label="Service"
            id="service-dropdown"
            />
            <Dropdown
              onChangeHandler={this.changeMetric}
              selectedValue={selectedMetric}
              selectionArray={metricsOfSelectedService}
              label="Metric"
              id="metric-dropdown"
            />
            <Dropdown
              onChangeHandler={this.changeEndpoint}
              selectedValue={selectedEndpoint}
              selectionArray={endpointsOfSelectedService}
              disabled={endpointDropdownDisabled}
              label="Endpoint"
              id="endpoint"
            />
            <Dropdown
              onChangeHandler={this.changeDataGranularity}
              selectedValue={selectedDataGranularity}
              selectionArray={Object.keys(dataGranularityMapping)}
              label="Scale"
              id="scale-dropdown"
            />
          </form>
        </div>
        {this.props.loadingServiceEnvAPM ? (
          <div style={{ position: 'absolute', top: '50%', left: '60%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress/></div>
        ) : (
          <Chart
            selectedService={selectedService}
            selectedMetric={selectedMetric}
            selectedEndpoint={selectedEndpoint}
            aggregatedData={aggregatedData}
            layout={layout}
            config={config}
            style={style}
          />)
        }
      </div>
    );
  }
}

Timeseries.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      environment: PropTypes.string.isRequired,
    }),
  ).isRequired,
  apmData: PropTypes.arrayOf(
    PropTypes.shape({
      cpuPercent: PropTypes.number,
      cpuStats: PropTypes.shape({
        onlineCpus: PropTypes.number,
        systemUsage: PropTypes.number,
        totalUsage: PropTypes.number,
        percpuUsage: PropTypes.arrayOf(PropTypes.number),
      }),
      memoryStats: PropTypes.shape({
        usage: PropTypes.number,
        max_usage: PropTypes.number,
        limit: PropTypes.number,
      }),
      name: PropTypes.string,
      service: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  ).isRequired,
  spans: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default withTracker(() => {
  const servicesSub = Meteor.subscribe('services');
  const apmSub = Meteor.subscribe('apmData');
  const spansSub = Meteor.subscribe('spans');
  const envsSub = Meteor.subscribe('environments');

  return {
    loadingServiceEnv: !(
      servicesSub.ready()
      && envsSub.ready()
    ),
    loadingServiceEnvAPM: !(
      servicesSub.ready()
      && envsSub.ready()
      && apmSub.ready()
    ),
    environments: Environments.find({}).fetch(),
    services: Services.find({}).fetch(),
    apmData: APMData.find({}).fetch(),
    spans: Spans.find().fetch(),
  };
})(Timeseries);

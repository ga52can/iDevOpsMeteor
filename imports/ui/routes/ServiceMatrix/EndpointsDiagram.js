import React from 'react';
import PropTypes from 'prop-types';
import CanvasJSReact from '../../../../lib/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;
const devName = serviceName => serviceName.split('-')[0];

class EndpointsDiagram extends React.Component {
  state = {
    selectedTargetService: '',
    selectedBaseService: '',
  };

  constructor() {
    super();
    this.storedData = [];
  }

  componentWillReceiveProps() {
    this.constructData();
    this.chart.render();
  }

  toggleDataSeries = e => {
    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  };

  updateChart = () => {
    this.constructData();
    this.chart.render();
  };

  getServiceListDatapoints = service => {
    const dataPoints = [];
    if (!service) return dataPoints;
    if (service.endpoints) {
      service.endpoints.forEach(endpoint => {
        dataPoints.push({
          label: `${endpoint.service.split('-')[2]}:${endpoint.http_method}`,
          y: endpoint.avg_response_time,
        });
      });
    }

    return dataPoints;
  };

  constructData = () => {
    const { selectedBaseService, selectedService } = this.props;
    let nameBase;
    let nameTarget;
    if (!selectedService) {
      nameTarget = '';
    } else {
      nameTarget = devName(selectedService.name);
    }
    if (!selectedBaseService) {
      nameBase = '';
    } else {
      nameBase = devName(selectedBaseService.name);
    }
    const dataPointsBase = this.getServiceListDatapoints(selectedBaseService);
    const dataPointsTarget = this.getServiceListDatapoints(selectedService);
    this.storedData = [
      {
        type: 'bar',
        xValueFormatString: '##0 ms',
        showInLegend: true,
        dataPoints: dataPointsBase,
        name: nameBase,
      },
      {
        type: 'bar',
        xValueFormatString: '##0 ms',
        showInLegend: true,
        dataPoints: dataPointsTarget,
        name: nameTarget,
      },
    ];
  };

  render = () => {
    const { selectedBaseService } = this.props;
    let { titleService } = 'Please select a service with Endpoints';
    if (selectedBaseService) {
      titleService  = selectedBaseService.name.split('-')[2];
    }
    this.constructData();
    const options = {
      zoomEnabled: true,
      theme: 'light2',
      title: {
        text: titleService,
      },
      axisX: {
        title: 'Endpoints',
      },
      axisY: {
        title: 'avg response time',
        suffix: ' ms',
        includeZero: false,
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: 'pointer',
        verticalAlign: 'top',
        fontSize: 18,
        fontColor: 'dimGrey',
        itemclick: this.toggleDataSeries,
      },
      data: this.storedData,
    };
    return (
      <div>
        <h3> _____________________________________ </h3>
        <CanvasJSChart
          options={options}
          onRef={ref => {
            this.chart = ref;
          }}
        />
      </div>
    );
  };
}

EndpointsDiagram.propTypes = {
  selectedService: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dependencies: PropTypes.arrayOf(PropTypes.string),
    endpoints: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        avg_response_time: PropTypes.number.isRequired,
      }),
    ),
  }),
  selectedBaseService: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dependencies: PropTypes.arrayOf(PropTypes.string),
    endpoints: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        avg_response_time: PropTypes.number.isRequired,
      }),
    ),
  }),
};

EndpointsDiagram.defaultProps = {
  selectedService: null,
  selectedBaseService: null,
};

export default EndpointsDiagram;

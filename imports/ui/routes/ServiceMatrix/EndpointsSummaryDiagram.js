import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'reactjs-admin-lte';
import CanvasJSReact from '../../../../lib/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;
devName = serviceName => serviceName.split('-')[0];

class EndpointsDiagramSummary extends React.Component {

  constructor() {
    super();
    this.storedData = [];
  }

  componentWillReceiveProps() {
    this.updateChart();
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

  getServiceListDatapoints = serviceList => {
    const dataPoints = [];
    let sumResponseTimes = 0;
    serviceList.forEach(service => {
      sumResponseTimes = 0;
      if (service.endpoints) {
        sumResponseTimes = service.endpoints.reduce(
          (count, act) => count + act.avg_response_time,
          0,
        );
        dataPoints.push({
          label: service.name,
          y: sumResponseTimes / service.endpoints.length,
        });
      }
    });
    return dataPoints;
  };

  constructData = () => {
    const { selectedBaseService, selectedService } = this.props;
    if (!selectedService) {
      return;
    }
    if (!selectedBaseService) {
      return;
    }
    const dataPointsBase = this.getServiceListDatapoints(selectedBaseService);
    const dataPointsTarget = this.getServiceListDatapoints(selectedService);
    let nameBaseEnv = 'EnvBase';
    let nameTargetEnv = 'EnvTarget';
    if (selectedBaseService[0]) {
      nameBaseEnv = selectedBaseService[0].name.split('-')[0];
    }
    if (selectedService[0]) {
       nameTargetEnv  = selectedService[0].name.split('-')[0];
    }
    this.storedData = [
      {
        type: 'column',
        xValueFormatString: '##0 ms',
        showInLegend: true,
        dataPoints: dataPointsBase,
        name: nameBaseEnv,
      },
      {
        type: 'column',
        xValueFormatString: '##0 ms',
        showInLegend: true,
        dataPoints: dataPointsTarget,
        name: nameTargetEnv,
      },
    ];
  };

  render = () => {
    this.constructData();
    const options = {
      zoomEnabled: true,
      theme: 'light2',
      title: {
        text: 'Avg. endpoint responses',
      },
      axisX: {
        title: 'Services',
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
        <Box>
          <Box.Body>
            <CanvasJSChart
              options={options}
              onRef={ref => {
                this.chart = ref;
              }}
            />
          </Box.Body>
        </Box>
      </div>
    );
  };
}

EndpointsDiagramSummary.propTypes = {
  selectedService: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dependencies: PropTypes.arrayOf(PropTypes.string),
      endpoints: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          avg_response_time: PropTypes.number.isRequired,
        }),
      ),
    }),
  ),
  selectedBaseService: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dependencies: PropTypes.arrayOf(PropTypes.string),
      endpoints: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          avg_response_time: PropTypes.number.isRequired,
        }),
      ),
    }),
  ),
};

EndpointsDiagramSummary.defaultProps = {
  selectedService: null,
  selectedBaseService: null,
};

export default EndpointsDiagramSummary;

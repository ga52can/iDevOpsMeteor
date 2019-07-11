import React from 'react';
import PropTypes from 'prop-types';
import Plot from '../../../../node_modules/react-plotly.js/react-plotly';

class Chart extends React.Component {
  buildPlotTitle = (selectedService, selectedMetric, selectedEndpoint) =>
    selectedMetric === 'response-time'
      ? `Response Time: ${selectedService} - ${selectedEndpoint}`
      : `${selectedService}: ${selectedMetric}`;

  buildYaxis = selectedMetric => {
    let yaxisTitle;
    let yaxisTickformat;
    if (selectedMetric === 'cpu') {
      yaxisTitle = 'CPU Usage  [ % ]';
      yaxisTickformat = ',.0%;';
    } else if (selectedMetric === 'memory') {
      yaxisTitle = 'Memory Usage  [ % ]';
      yaxisTickformat = ',.0%;';
    } else if (selectedMetric === 'response-time') {
      yaxisTitle = 'Response Time [ ms ]';
      yaxisTickformat = ', ms;';
    }
    return { yaxisTitle, yaxisTickformat };
  };

  buildTraces = aggregatedDataAsTimeseries => {
    const traces = [];
    Object.entries(aggregatedDataAsTimeseries).forEach(
      ([identifier, serviceData]) => {
        const { timestamps, values } = serviceData;
        const trace = this.buildTrace(timestamps, values, identifier);
        traces.push(trace);
      },
    );
    return traces;
  };

  buildTrace = (x, y, name) => ({
    type: 'scatter',
    mode: 'lines+markers',
    x,
    y,
    name,
  });

  render() {
    const {
      selectedService,
      selectedMetric,
      selectedEndpoint,
      aggregatedData,
      layout,
      config,
      style,
    } = this.props;

    const title = this.buildPlotTitle(
      selectedService,
      selectedMetric,
      selectedEndpoint,
    );
    const traces = this.buildTraces(aggregatedData);
    const { yaxisTitle, yaxisTickformat } = this.buildYaxis(selectedMetric);

    layout.title = title;
    layout.yaxis.title = yaxisTitle;
    layout.yaxisTickformat = yaxisTickformat;

    return (
      <div>
        <Plot data={traces} layout={layout} config={config} style={style} />
      </div>
    );
  }
}

Chart.propTypes = {
  selectedService: PropTypes.string.isRequired,
  selectedMetric: PropTypes.string.isRequired,
  selectedEndpoint: PropTypes.string,
  aggregatedData: PropTypes.shape({}).isRequired,
  layout: PropTypes.shape({}).isRequired,
  config: PropTypes.shape({}).isRequired,
  style: PropTypes.shape({}).isRequired,
};

export default Chart;

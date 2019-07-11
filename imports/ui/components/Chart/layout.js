const backgroundColorChart = '#ECF0F5';
const backgroundColorRangeSlider = '#DDE0E5';
const axisColor = 'rgb(204, 204, 204)';

const layout = {
  autosize: true,
  height: 650,
  font: {
    size: 14,
  },
  xaxis: {
    title: 'Time',
    showgrid: false,
    showline: true,
    showticklabels: true,
    linecolor: axisColor,
    linewidth: 2,
    ticks: 'outside',
    tickcolor: axisColor,
    tickwidth: 2,
    ticklen: 5,
    rangeslider: {
      bgcolor: backgroundColorRangeSlider,
      bordercolor: backgroundColorRangeSlider,
      borderwidth: 1,
      thickness: 0.1,
    },
  },
  yaxis: {
    tickmode: 'auto',
    nticks: 6,
    automargin: true,
    gridwidth: 2,
  },
  paper_bgcolor: backgroundColorChart,
  plot_bgcolor: backgroundColorChart,
  showlegend: true,
  legend: {
    orientation: 'h',
    xanchor: 'center',
    y: 1.1,
    x: 0.5,
  },
};

export default layout;

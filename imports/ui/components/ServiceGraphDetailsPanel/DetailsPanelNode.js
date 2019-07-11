import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import './detailsPanel.css';

class DetailsPanelNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      node: props.node,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { node } = nextProps;
    this.setState({ node });
  }

  extractImageName = string => string.split('-')[1];

  render() {
    const { node } = this.state;
    const { closeCallback } = this.props;
    const { metadata } = node;
    const { apmData } = metadata;

    const cpuPercentage =
      apmData != null && apmData.cpuPercent != null ? apmData.cpuPercent : '?';
    const memoryPercentage =
      apmData != null && apmData.memoryStats != null
        ? (apmData.memoryStats.usage / apmData.memoryStats.limit) * 100
        : '?';

    return (
      <div className="details-panel">
        <Card>
          <CardHeader
            title={node.name}
            action={
              <IconButton onClick={closeCallback}>
                <CloseIcon />
              </IconButton>
            }
            style={{ fontWeight: 550, textAlign: 'center' }}
          />
          <CardContent>
            <Typography variant="h6" component="p">
              Image name:{' '}
              <strong> {this.extractImageName(metadata.name)} </strong>{' '}
            </Typography>
            <Typography variant="h6" component="p">
              Container status: <strong> {metadata.status} </strong>{' '}
            </Typography>
            <hr />
            <Typography
              variant="h6"
              style={{ fontWeight: 550, textAlign: 'center' }}
            >
              > APM data
            </Typography>
            <List dense>
              <ListItem>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 550, textAlign: 'center' }}
                >
                  > CPU: <strong> { parseFloat(cpuPercentage).toFixed(2) } % </strong>{' '}
                </Typography>
              </ListItem>

              <ListItem>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 550, textAlign: 'center' }}
                >
                  > RAM: <strong> { parseFloat(memoryPercentage).toFixed(2) } % </strong>{' '}
                </Typography>
              </ListItem>

            </List>
          </CardContent>
        </Card>
      </div>
    );
  }
}

DetailsPanelNode.propTypes = {
  closeCallback: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
};

export default DetailsPanelNode;

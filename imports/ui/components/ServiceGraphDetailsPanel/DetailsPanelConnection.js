import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import './detailsPanel.css';

class DetailsPanelConnection extends React.Component {
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

  render() {
    const { node } = this.state;
    const { closeCallback } = this.props;
    const { metadata } = node;
    const { sourceMetadata, targetMetadata } = metadata;
    const { endpoints } = sourceMetadata;
    let filteredEndpoints = [];
    if (!!endpoints) {
      filteredEndpoints = endpoints.filter(e => e.service === targetMetadata.name);
    }

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
            style={{ fontWeight: 500, textAlign: 'center' }}
          />
          <CardContent>
            <Typography variant="h6" component="p">
              Endpoints:{' '}
            </Typography>
            <hr />
            {endpoints == null ? (
              <h5 className="error"> Failed to fetch endpoints </h5>
            ) : (
              filteredEndpoints.map(endpoint => (
                <List dense key={Math.random()}>
                  <ListItem>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 550, textAlign: 'center' }}
                    >
                      > HTTP method: <strong> {endpoint.http_method} </strong>
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 550, textAlign: 'center' }}
                    >
                      > HTTP scheme: <strong> {endpoint.http_scheme} </strong>
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 550, textAlign: 'center' }}
                    >
                      > HTTP url: <strong> {endpoint.http_url}</strong>
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 550, textAlign: 'center' }}
                    >
                      > Controller method:{' '}
                      <strong> {endpoint.controller_method} </strong>
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 550, textAlign: 'center' }}
                    >
                      > Average response time:{' '}
                      <strong> { parseFloat(endpoint.avg_response_time).toFixed(2) } ms </strong>
                    </Typography>
                  </ListItem>
                  <hr />
                </List>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

DetailsPanelConnection.propTypes = {
  closeCallback: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
};

export default DetailsPanelConnection;

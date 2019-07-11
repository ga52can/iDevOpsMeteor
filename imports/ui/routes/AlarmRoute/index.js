import React, { Component } from 'react';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Switch, Route } from 'react-router-dom';

import Alarms from '../../../api/alarms';
import Environments from '../../../api/environments';

import AlarmList from '../../components/AlarmList';
import AlarmCreate from '../../components/AlarmCreate';
import Heading from '../../components/Heading';

class AlarmRoute extends Component {
  render() {
    const { alarms, environments } = this.props;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <Heading text="Alarms"/>
          </Col>
        </Row>
        <Switch>
          <Route
            path="/alarms"
            exact
            render={() => <AlarmList alarms={alarms} />}
          />
          <Route
            path="/alarms/create"
            render={() => <AlarmCreate environments={environments} />}
          />
        </Switch>
      </Grid>
    );
  }
}

AlarmRoute.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  environments: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('alarms');
  Meteor.subscribe('environments');
  return {
    alarms: Alarms.find({}).fetch(),
    environments: Environments.find({}).fetch(),
  };
})(AlarmRoute);

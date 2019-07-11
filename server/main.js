import { Meteor } from 'meteor/meteor';
import Environments from '/imports/api/environments';
import Services from '/imports/api/services';
import Alarms from '/imports/api/alarms';

import './publications';

import './methods';
import setupAPI from './api';
import setupFixtures from './fixtures';
import pollDataFromZipkin from './integrations/zipkin-polling-service';
import pollDataFromDockerEnvironments from './integrations/polling-docker-environment-stats';
import { pollDockerStatsInterval } from './integrations/poll-docker-stats';

const INTERVAL = 30000; // 30 sec

Meteor.startup(() => {
  Alarms._ensureIndex({ name: 1 }, { unique: true });
  Services._ensureIndex({ name: 1 }, { unique: true });
  Environments._ensureIndex({ identifier: 1 }, { unique: true });

  const NODE_ENV = process.env.NODE_ENV || 'production';
  const POLL_DOCKER_STATS = process.env.POLL_DOCKER_STATS || true;
  const ZIPKIN_POLL = process.env.ZIPKIN_POLL || true;
  const DOCKER_POLL = process.env.DOCKER_POLL || true;

  if (NODE_ENV === 'development') {
    console.log("get fixtures");
    setupFixtures();
  }

  setupAPI();

  if (POLL_DOCKER_STATS) {
    console.log('POLL_DOCKER_STATS active');
    pollDockerStatsInterval(INTERVAL);
  }

  if (ZIPKIN_POLL) {
    console.log('ZIPKIN_POLL active');
    pollDataFromZipkin(INTERVAL);
  }

  if (DOCKER_POLL) {
    console.log('DOCKER_POLL active');
    pollDataFromDockerEnvironments(INTERVAL);
  }
});

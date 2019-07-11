import { Meteor } from 'meteor/meteor';
import { pollDockerStats } from './integrations/poll-docker-stats';

Meteor.methods({
  pollDockerStats,
});

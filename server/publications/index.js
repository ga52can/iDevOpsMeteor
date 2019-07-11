import { Meteor } from 'meteor/meteor';
import Environments from '/imports/api/environments';
import Services from '/imports/api/services';
import Spans from '/imports/api/spans';
import ApmData from '/imports/api/apm';
import Alarms from '/imports/api/alarms';

if (Meteor.isServer) {
  Meteor.publish('environments', () => Environments.find());

  Meteor.publish('services', () => Services.find());

  Meteor.publish(
    'spans',
    () => Spans.find({}, { sort: { timestamp: 1 }, limit: 7200 }), // about last 2 hours worth of spans
  );

  Meteor.publish(
    'apmData',
    () => ApmData.find({}, { sort: { timestamp: 1 }, limit: 7200 }), // about last 2 hours worth of apm data
  );

  Meteor.publish('alarms', () => Alarms.find());
}

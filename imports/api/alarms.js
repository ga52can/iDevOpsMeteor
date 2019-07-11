import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Alarms = new Mongo.Collection('alarms');

export const AlarmSchema = new SimpleSchema({
  name: { type: String },
  reference: { type: String },
  operator: { type: String },
  threshold: { type: Number },
});

Alarms.attachSchema(AlarmSchema);

Alarms.allow({
  insert: function() {
    return true;
  },
});

export default Alarms;

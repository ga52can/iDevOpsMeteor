import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Environments = new Mongo.Collection('environments');

export const EnvironmentSchema = new SimpleSchema({
  name: { type: String },
  identifier: { type: String },
  ip: { type: String, optional: true },
  containerInfo: { type: Object, blackbox: true, optional: true}
});

Environments.attachSchema(EnvironmentSchema);

export default Environments;

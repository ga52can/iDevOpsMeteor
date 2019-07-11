import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { ApmDataSchema } from './apm';
import { EndpointSchema } from './endpoint';

const Services = new Mongo.Collection('services');

export const ServiceSchema = new SimpleSchema({
  name: { type: String },
  environment: { type: String },
  dockerImage: { type: String, optional: true },
  status: { type: String },
  health: { type: String, optional: true },
  apmData: { type: ApmDataSchema, optional: true },
  dependencies: { type: Array, optional: true },
  'dependencies.$': { type: String, optional: true },
  endpoints: { type: Array, optional: true },
  'endpoints.$': { type: EndpointSchema },
});

Services.attachSchema(ServiceSchema);

export default Services;

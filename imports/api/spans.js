import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Spans = new Mongo.Collection('spans');

export const SpanEndpointSchema = new SimpleSchema({
  serviceName: { type: String },
  ipv4: { type: String },
  ipv6: { type: String, optional: true },
  //ipv4Bytes: { type: String },
  //ipv6Bytes: { type: String, optional: true },
  port: { type: Number, optional: true },
});

export const SpanTagSchema = new SimpleSchema({
  host_ip: { type: String, optional: true },
  http_method: { type: String, optional: true },
  http_path: { type: String, optional: true },
  http_scheme: { type: String, optional: true },
  http_url: { type: String, optional: true },
  controller_method: { type: String, optional: true },
});

export const SpanSchema = new SimpleSchema({
  id: { type: String },
  name: { type: String },
  traceId: { type: String },
  parentId: { type: String, optional: true },
  kind: { type: String },
  endpointName: {type: String, optional: true},
  timestamp: { type: Number },
  duration: { type: Number },
  localEndpoint: { type: SpanEndpointSchema },
  remoteEndpoint: { type: SpanEndpointSchema, optional: true },
  annotations: { type: Array, optional: true },
  'annotations.$': {
    type: Object,
    optional: true,
    blackbox: true,
  },
  tags: { type: SpanTagSchema, optional: true },
  remoteEndpointTags: { type: SpanTagSchema, optional: true },
});

Spans.attachSchema(SpanSchema);

export default Spans;

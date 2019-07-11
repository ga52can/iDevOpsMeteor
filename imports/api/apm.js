import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ApmDataMemorySchema = new SimpleSchema({
  usage: { type: Number, optional: true },
  max_usage: { type: Number, optional: true },
  limit: { type: Number, optional: true },
});

export const ApmDataCpuSchema = new SimpleSchema({
  totalUsage: { type: Number, optional: true },
  systemUsage: { type: Number, optional: true },
  percpuUsage: { type: Array, optional: true },
  'percpuUsage.$': { type: Number, optional: true },
  onlineCpus: { type: Number, optional: true },
});

export const ApmDataMetricsDataSchema = new SimpleSchema({
  cpu: { type: Array, optional: true },
  'cpu.$': { type: Number, optional: true },
  memory: { type: Array, optional: true },
  'memory.$': { type: Number, optional: true },
  io: { type: Array, optional: true },
  'io.$': { type: Number, optional: true },
});

export const ApmDataMetricsSchema = new SimpleSchema({
  timestamp: { type: Array, optional: true },
  'timestamp.$': { type: String, optional: true },
  data: { type: ApmDataMetricsDataSchema, optional: true },
});

export const ApmDataSchema = new SimpleSchema({
  service: { type: String, optional: true },
  timestamp: { type: String, optional: true },
  name: { type: String, optional: true },
  read: { type: String, optional: true },
  memoryStats: { type: ApmDataMemorySchema, optional: true },
  cpuStats: { type: ApmDataCpuSchema, optional: true },
  cpuPercent: { type: Number, optional: true },
  metrics: { type: ApmDataMetricsSchema, optional: true },
});

const ApmData = new Mongo.Collection('apmData');

ApmData.attachSchema(ApmDataSchema);

export default ApmData;

import SimpleSchema from 'simpl-schema';

export const EndpointSchema = new SimpleSchema({
  service: { type: String, optional: true },
  endpointName: { type: String, optional: true },
  http_method: { type: String, optional: true },
  http_path: { type: String, optional: true },
  http_scheme: { type: String, optional: true },
  http_url: { type: String, optional: true },
  controller_method: { type: String, optional: true },
  avg_response_time: { type: Number, optional: true },
});

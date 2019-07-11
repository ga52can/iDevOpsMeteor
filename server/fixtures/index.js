import Environments from '/imports/api/environments';
import Services from '/imports/api/services';
import Spans from '/imports/api/spans';
import ApmData from '/imports/api/apm';
import { Promise } from 'meteor/promise';

import environments from './environments.json';
import spans from './spans.json';
import apmData from './apm.json';
import services from './services.json';
// import servicesBuilder from './services.js';

const setupFixtures = () => {
  // Environments
  if (Environments.find().count() === 0) {
    environments.forEach(environment => Environments.insert(environment));
  }

  if (ApmData.find().count() === 0) {
    apmData.forEach(apm => ApmData.insert(apm));
  }

  // Services
  if (Services.find().count() === 0) {
    //    Environments.find()
    //      .fetch()
    //      .forEach(environment => {
    //        const services = servicesBuilder(environment);
    //        services.forEach(service => {
    //          Services.upsert({ name: service.name }, { $set: service });
    //        });
    //      });
    services.forEach(service => Services.insert(service));
  }

  // spans
  if (Spans.find().count() === 0) {
    spans.forEach(span => {
      if (Object.keys(span.tags).length > 0) {
        const env = span.name.split('-')[0];
        try {
          Environments.update(
            { identifier: env },
            { $set: { ip: span.tags.host_ip } },
          );
        } catch (err) {
          console.log(err);
        }
      }

      const newSpan = span;
      if (newSpan.parentId === null) {
        // a parent span
        // find direct child of this and insert as a remote endpoint the tags
        const childSpans = Spans.find({ parentId: newSpan.id }).fetch();
        if (childSpans.length > 0) {
          newSpan.remoteEndpointTags = childSpans[0].tags;
          newSpan.remoteEndpoint = childSpans[0].localEndpoint;
        }
      }

      Spans.insert({
        id: newSpan.id,
        name: newSpan.localEndpoint.serviceName,
        traceId: newSpan.traceId,
        parentId: newSpan.parentId,
        kind: newSpan.kind,
        timestamp: newSpan.timestamp,
        duration: newSpan.duration,
        debug: newSpan.debug,
        shared: newSpan.shared,
        localEndpoint: newSpan.localEndpoint,
        remoteEndpoint: newSpan.remoteEndpoint,
        remoteEndpointTags: newSpan.remoteEndpointTags,
        annotations: newSpan.annotations,
        tags: {
          host_ip: newSpan.tags.host_ip,
          http_method: newSpan.tags.http_method,
          http_path: newSpan.tags.http_path,
          http_scheme: newSpan.tags.http_scheme,
          http_url: newSpan.tags.http_url,
          controller_method: newSpan.tags.controller_method,
        },
      });

      if (
        !!newSpan.remoteEndpoint &&
        Object.keys(newSpan.remoteEndpointTags).length > 0
      ) {
        /**
         * Average is calculated per (local,remote) endpoint,
         */
        const avgResponseTime = Promise.await(
          Spans.rawCollection()
            .aggregate([
              {
                $match: {
                  'localEndpoint.serviceName':
                    newSpan.localEndpoint.serviceName,
                  'remoteEndpoint.serviceName':
                    newSpan.remoteEndpoint.serviceName,
                  'remoteEndpointTags.http_url':
                    newSpan.remoteEndpointTags.http_url,
                  'remoteEndpointTags.http_method':
                    newSpan.remoteEndpointTags.http_method,
                  'remoteEndpointTags.controller_method':
                    newSpan.remoteEndpointTags.controller_method,
                },
              },
              {
                $group: {
                  _id: `${newSpan.remoteEndpointTags.http_method}_${
                    newSpan.remoteEndpointTags.http_url
                  }_${newSpan.localEndpoint.serviceName}_${
                    newSpan.remoteEndpoint.serviceName
                  }`,
                  avg_response_time: { $avg: '$duration' },
                },
              },
            ])
            .toArray(),
        );

        if (avgResponseTime.length > 0) {
          Services.update(
            {
              name: newSpan.localEndpoint.serviceName,
              endpoints: {
                $not: {
                  $elemMatch: {
                    service: newSpan.remoteEndpoint.serviceName,
                    http_method: newSpan.remoteEndpointTags.http_method,
                    http_scheme: newSpan.remoteEndpointTags.http_scheme,
                    http_url: newSpan.remoteEndpointTags.http_url,
                    controller_method:
                      newSpan.remoteEndpointTags.controller_method,
                  },
                },
              },
            },
            {
              $addToSet: {
                endpoints: {
                  service: newSpan.remoteEndpoint.serviceName,
                  http_method: newSpan.remoteEndpointTags.http_method,
                  http_path: newSpan.remoteEndpointTags.http_path,
                  http_scheme: newSpan.remoteEndpointTags.http_scheme,
                  http_url: newSpan.remoteEndpointTags.http_url,
                  controller_method:
                    newSpan.remoteEndpointTags.controller_method,
                  avg_response_time:
                    avgResponseTime[0].avg_response_time / 1000,
                },
              },
            },
          );
          // update field if found
          Services.update(
            {
              name: newSpan.localEndpoint.serviceName,
              'endpoints.service': newSpan.remoteEndpoint.serviceName,
              'endpoints.http_method': newSpan.remoteEndpointTags.http_method,
              'endpoints.http_path': newSpan.remoteEndpointTags.http_path,
              'endpoints.http_scheme': newSpan.remoteEndpointTags.http_scheme,
              'endpoints.http_url': newSpan.remoteEndpointTags.http_url,
              'endpoints.controller_method':
                newSpan.remoteEndpointTags.controller_method,
            },
            {
              $set: {
                'endpoints.$.avg_response_time':
                  avgResponseTime[0].avg_response_time / 1000,
              },
            },
          );
        }
      }
    });
  }
};

export default setupFixtures;

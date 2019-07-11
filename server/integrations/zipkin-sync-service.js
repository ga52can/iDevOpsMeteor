import Environments from '/imports/api/environments';
import Services from '/imports/api/services';
import Spans from '/imports/api/spans';

export function insertServices(services) {
  services.forEach(serviceName => {
    const parts = serviceName.split('-');

    const env = Environments.findOne({ identifier: parts[0] });
    let envId = env == null ? null : env._id;
    if (env == null) {
      envId = Environments.insert({ name: parts[0], identifier: parts[0] });
    }

    try {
      Services.insert({
        name: serviceName,
        environment: envId,
        status: 'Operational',
        apmData: {},
        dependencies: [],
      });
    } catch (err) {
      //      console.error(err);
    }
  });
}

export function insertDependencies(links) {
  links.forEach(link => {
    try {
      Services.update(
        {
          name: link.parent,
        },
        {
          $addToSet: {
            dependencies: link.child,
          },
        }
      );
    } catch (err) {
      // console.error(err);
    }
  });
}

export function insertSpans(traces) {
  traces.forEach(spans => {
    spans.forEach(span => {
      console.log('1: span.name: ' + span.localEndpoint.serviceName.split('-')[2]);

      if (typeof span.tags !== 'undefined' && Object.keys(span.tags).length > 0) {
        //console.log('tags: ' + span.tags);
        const env = span.localEndpoint.serviceName.split('-')[0];
        try {
          Environments.update(
            { identifier: env },
            { $set: { ip: span.tags.host_ip } }
          );
        } catch (err) {
          //      console.log(err);
        }
      }

      try {
        const newSpan = span;
        if (typeof newSpan.parentId == 'undefined') { // a parent span
           // find direct child of this and insert it as a remote endpoint the tags
           const childSpans = Spans.find({ parentId: newSpan.id }).fetch();
           if (childSpans.length > 0) {
             newSpan.remoteEndpointTags = childSpans[0].tags;
             newSpan.remoteEndpoint = childSpans[0].localEndpoint;
           }
         }
        console.log('2: newSpan.id: ' + newSpan.id);
        let tags = null;
        if(typeof newSpan.tags !== 'undefined') {
          tags = {
            host_ip: typeof newSpan.tags.host_ip === 'undefined' ? null : newSpan.tags.host_ip,
            http_method: typeof newSpan.tags['http.method'] === 'undefined' ? null : newSpan.tags['http.method'],
            http_path: newSpan.tags['http.path'],
            http_scheme: newSpan.tags['http.scheme'],
            http_url: newSpan.tags['http.url'],
            controller_method: newSpan.tags['mvc.controller.method'],
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
          endpointName: newSpan.name,
          localEndpoint: newSpan.localEndpoint,
          remoteEndpoint: newSpan.remoteEndpoint,
          remoteEndpointTags: newSpan.remoteEndpointTags,
          annotations: newSpan.annotations,
          tags: tags,
        });

        if (
          !!newSpan.remoteEndpoint
          &&
          Object.keys(newSpan.remoteEndpointTags).length > 0
        ) {
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
                    //'endpointName':
                    //    newSpan.name
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
              .toArray()
          );

          console.log("response Time: " + avgResponseTime.map(time => time.avg_response_time));

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
              }
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
              }
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
}

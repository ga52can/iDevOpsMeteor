import { Restivus } from 'meteor/nimble:restivus';

import {
  insertServices,
  insertDependencies,
  insertSpans,
} from './integrations/zipkin-sync-service';

export default () => {
  const restApi = new Restivus({
    apiPath: 'api/',
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
    prettyJson: true,
    useDefaultAuth: false,
    version: 'v1',
  });

  restApi.addRoute('/', {
    get: {
      action: () => ({
        statusCode: 200,
        body: { status: 'success', message: 'Hello world!' },
      }),
    },
  });

  restApi.addRoute('spans', {
    post: {
      action() {
        insertSpans(this.bodyParams);
        return {
          statusCode: 200,
          body: { status: 'success', message: '' },
        };
      },
    },
  });

  restApi.addRoute('services', {
    post: {
      action() {
        insertServices(this.bodyParams);
        return {
          statusCode: 200,
          body: { status: 'success', message: '' },
        };
      },
    },
  });

  restApi.addRoute('deps', {
    post: {
      action() {
        insertDependencies(this.bodyParams);
        return {
          statusCode: 200,
          body: { status: 'success', message: '' },
        };
      },
    },
  });
};

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { insertServices, insertDependencies, insertSpans } from './zipkin-sync-service';

// call an Endpoint each X millisecond
function pollDependencies(endpoint, interval, callback) {
  Meteor.setInterval(() => {
    const timestamp = new Date().getTime();
    HTTP.get(endpoint + timestamp, {}, (err, response) => {
      if (err) {
        console.error(err);
      } else {
        callback(response.data);
      }
    });
  }, interval);
}

function pollServices(endpoint, interval, callback) {
  Meteor.setInterval(() => {
    HTTP.get(endpoint, {}, (err, response) => {
      if (err) {
        console.error(err);
      } else {
        callback(response.data);
      }
    });
  }, interval);
}

function pollSpans(endpoint, interval, callback) {
	  Meteor.setInterval(() => {
		    HTTP.get(endpoint, {}, (err, response) => {
		      if (err) {
		        console.error(err);
		      } else {
		        console.log('0: response.data: ' + response.data)
		        callback(response.data);
		      }
		    });
		  }, interval);
		}

	
export default function pollDataFromZipkin(interval) {
  console.log('pollDataFromZipkin');
  const ZIPKIN_HOST = process.env.ZIPKIN_HOST || 'localhost';
  const ZIPKIN_PORT = process.env.ZIPKIN_PORT || '9411';
  const SERVICES_ENDPOINT = `${ZIPKIN_HOST}:${ZIPKIN_PORT}/api/v2/services`;
  const DEPENDENCIES_ENDPOINT = `${ZIPKIN_HOST}:${ZIPKIN_PORT}/api/v2/dependencies?endTs=`;
  const SPANS_ENDPOINT = `${ZIPKIN_HOST}:${ZIPKIN_PORT}/api/v2/traces`;

  pollServices(SERVICES_ENDPOINT, interval, insertServices);
  pollDependencies(DEPENDENCIES_ENDPOINT, interval, insertDependencies);
  pollSpans(SPANS_ENDPOINT, interval, insertSpans);
  // zipkin services represent all instances running not the services
}

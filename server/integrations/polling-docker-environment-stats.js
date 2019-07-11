import { Meteor } from 'meteor/meteor';
import Environments from '/imports/api/environments';

const Docker = require('dockerode');
const dockerPort = 2375;

function pollSingleStats(endpoint, apiPort, environmentId) {
  const docker = new Docker({ host: endpoint, port: dockerPort });
  console.log('Pull docker single stats for', endpoint, environmentId);
  docker.listContainers(
    { stream: false },
    Meteor.bindEnvironment((err, statsString) => {
      if (err) {
        console.error(err);
      } else {
        // sanitizing fix for mongoDB
        let objectString = JSON.stringify(statsString);
        objectString = objectString.replace(
          /com\.docker\.compose\./gm,
          'com_docker_compose_'
        );
        const sanitizedString = JSON.parse(objectString);
        Environments.update(
          { _id: environmentId },
          {
            $set: {
              containerInfo: sanitizedString
            },
          }
        );
      }
    })
  );
}

function pollStatics() {
  const cursor = Environments.find();
  cursor.forEach(result => {
	    pollSingleStats(result.ip, dockerPort, result._id);
	    //pollSingleStats('172.17.0.1', dockerPort, result._id);
  });
}

export default function pollDataFromDockerEnvironments(interval) {
  Meteor.setInterval(() => {
    pollStatics();
  }, interval);
}

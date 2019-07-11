import { Meteor } from 'meteor/meteor';

import Services from '/imports/api/services';
import Environments from '/imports/api/environments';
import APMData from '../../imports/api/apm';

import calcCpuUsage from '../cpu-usage';

const Docker = require('dockerode');
const dockerPort = process.env.DOCKER_PORT || 2375;

const pollDockerServiceStats = async service => {
  const environment = Environments.findOne(service.environment);
  const dockerHost = environment.ip;
  let docker = new Docker({ host: dockerHost, port: dockerPort });

  if(process.env.DOCKER_LOCAL || false)
    docker = new Docker({socketPath: '/var/run/docker.sock'}); //for localhost

  const containerName = service.name.split('-')[2];

  console.log('Getting docker data for ', service.name, 'on port', dockerPort);

  const container = docker.getContainer(containerName);
  const info = await container.inspect();
  if(info) {
    const stats = await container.stats({stream: false});

    let cpuPercent = 0;
    if (service.apmData && Object.keys(service.apmData).length > 0) {
      cpuPercent = calcCpuUsage(
        //service.apmData.cpuStats.totalUsage,
        //service.apmData.cpuStats.systemUsage,
        stats.precpu_stats.cpu_usage.total_usage,
        stats.precpu_stats.system_cpu_usage,
        {
          cpuStats: {
            totalUsage: stats.cpu_stats.cpu_usage.total_usage,
            systemUsage: stats.cpu_stats.system_cpu_usage,
            percpuUsage: stats.cpu_stats.cpu_usage.percpu_usage,
            onlineCpus: stats.cpu_stats.online_cpus,
          },
        },
      );
    }
    Services.update(
      {_id: service._id},
      {
        $set: {
          dockerImage: info.Config.Image,
          status: info.State.Status,
          //health: info.State.Health.Status,
          //status: 'running',
          health: 'good',
          apmData: {
            name: stats.name,
            read: stats.read,
            memoryStats: stats.memory_stats,
            cpuPercent,
            cpuStats: {
              totalUsage: stats.cpu_stats.cpu_usage.total_usage,
              systemUsage: stats.cpu_stats.system_cpu_usage,
              percpuUsage: stats.cpu_stats.cpu_usage.percpu_usage,
              onlineCpus: stats.cpu_stats.online_cpus,
            },
            metrics: stats.metrics,
          },
        },
      },
    );

    APMData.upsert(
      {service: service._id, timestamp: stats.read},
      {
        $set: {
          name: stats.name,
          read: stats.read,
          memoryStats: stats.memory_stats,
          cpuPercent,
          cpuStats: {
            totalUsage: stats.cpu_stats.cpu_usage.total_usage,
            systemUsage: stats.cpu_stats.system_cpu_usage,
            percpuUsage: stats.cpu_stats.cpu_usage.percpu_usage,
            onlineCpus: stats.cpu_stats.online_cpus,
          },
          metrics: stats.metrics,
        },
      },
    );
  }
};

const pollDockerStats = () =>
  Services.find().forEach(service => {
    pollDockerServiceStats(service);
  });

const pollDockerStatsInterval = interval => {
  Meteor.setInterval(() => {
    pollDockerStats();
  }, interval);
};

export { pollDockerStats, pollDockerStatsInterval };

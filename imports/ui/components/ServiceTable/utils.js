const removeEnvironmentFromServiceName = serviceName =>
  serviceName.split('-')[2];

export const groupServicesByName = (environments, services) =>
  services
    .map(service =>
      Object.assign(service, {
        environment: environments.find(
          environment => environment._id === service.environment,
        ),
      }),
    )
    .map(service =>
      Object.assign(service, {
        name: removeEnvironmentFromServiceName(service.name),
      }),
    );

export const renderMemoryUsage = apmData =>
  `${(apmData.memoryStats.usage / apmData.memoryStats.limit).toFixed(2)} %`;

export const renderCpuUsage = apmData =>
  `${(apmData.cpuPercent * 100).toFixed(2)} %`;

export const renderResponseTime = service => {
  const endpoints = service.endpoints ? service.endpoints : [];

  const responseTimes = endpoints.map(endpoint => endpoint.avg_response_time);

  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

  const minResponseTime =
    responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const maxResponseTime =
    responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

  return `${averageResponseTime.toFixed(0)}ms (Min: ${minResponseTime.toFixed(
    0,
  )}ms, Max: ${maxResponseTime.toFixed(0)}ms)`;
};

export const constructResponseTimes = (services, service) => {
  const allEndpoints = services
    .map(s => (s.endpoints ? s.endpoints : null))
    .filter(e => e !== null)
    .flat(1);
  const endpoints = allEndpoints.filter(
    e =>
      !!e.service &&
      e.service.match(`${service.environment.identifier}-(.*)-${service.name}`),
  );
  const responseTimes = endpoints.map(endpoint => endpoint.avg_response_time);

  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
  return averageResponseTime;
};

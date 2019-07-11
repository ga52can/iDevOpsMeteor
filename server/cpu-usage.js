export const calculateCpuPercentUnix = (
  previousCpuUsage,
  previousSystemUsage,
  apmData,
) => {
  //var cpuDelta = res.cpu_stats.cpu_usage.total_usage -  res.precpu_stats.cpu_usage.total_usage;
  //var systemDelta = res.cpu_stats.system_cpu_usage - res.precpu_stats.system_cpu_usage;
  //var RESULT_CPU_USAGE = cpuDelta / systemDelta * 100;
  // calculate the change for the cpu usage of the container in between readings
  const cpuDelta = apmData.cpuStats.totalUsage - previousCpuUsage;
  // calculate the change for the entire system between readings
  const systemDelta = apmData.cpuStats.systemUsage - previousSystemUsage;

  if (systemDelta > 0.0 && cpuDelta > 0.0) {
    return (
      (cpuDelta / systemDelta) * 100.0
    );
  }

  return 0.0;
};

export default calculateCpuPercentUnix;

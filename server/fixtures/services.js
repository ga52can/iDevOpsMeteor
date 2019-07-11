function getRandomTimeseriesData() {
  const timeseries = [];
  for (let i = 0; i < 20; i += 1) {
    timeseries.push(Math.floor(Math.random() * 10 + 1));
  }
  return timeseries;
}

function getTimeseriesDates() {
  const timeseries = [];
  for (let i = 1; i < 21; i += 1) {
    timeseries.push(`2019-01-${i}`);
  }
  return timeseries;
}

export default ({ identifier, _id }) => [
  {
    name: `${identifier}-demodeviceqclient-qclient`,
    environment: _id,
    dockerImage: 'abdoofathy/demodeviceqclient-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 23.81,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [],
  },
  {
    name: `${identifier}-demodevicerunner-data_runner`,
    environment: _id,
    dockerImage: 'abdoofathy/demodevicerunner-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 23.81,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [
      `${identifier}-demodeviceqclient-qclient`,
      `${identifier}-demodevicesystemdataencoder-data_encoder`,
      `${identifier}-demodevicesystemdataservice-data_service`,
    ],
  },
  {
    name: `${identifier}-demodevicerunner-temp_runner`,
    environment: _id,
    dockerImage: 'abdoofathy/demodevicerunner-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 23.81,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [
      `${identifier}-demodeviceqclient-qclient`,
      `${identifier}-demodevicetemperatureencoder-temp_encoder`,
      `${identifier}-demodevicetemperatureservicefake-temp_service`,
    ],
  },
  {
    name: `${identifier}-demodevicesystemdataencoder-data_encoder`,
    environment: _id,
    dockerImage: 'abdoofathy/demodevicesystemdataencoder-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 23.81,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [],
  },
  {
    name: `${identifier}-demodevicesystemdataservice-data_service`,
    environment: _id,
    dockerImage: 'abdoofathy/demodevicesystemdataservice-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 23.81,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [],
  },
  {
    name: `${identifier}-demodevicetemperatureencoder-temp_encoder`,
    environment: _id,
    dockerImage: 'abdoofathy/demodevicetemperatureencoder-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 23.81,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [],
  },
  {
    name: `${identifier}-demodevicetemperatureservicefake-temp_service`,
    environment: _id,
    dockerImage: 'abdoofathy/demodevicetemperatureservicefake-x64:zipkin',
    status: 'running',
    health: 'healthy',
    apmData: {
      name: 'docker-image',
      read: '2019-01-15T20:23:57.303023319Z',
      memoryStats: {
        usage: 33267712,
        max_usage: 36569088,
        limit: 67108864,
      },
      cpuPercent: 0,
      cpuStats: {
        totalUsage: 3820520019,
        systemUsage: 34174030160000000,
        percpuUsage: [2018289359, 1802230660],
        onlineCpus: 2,
      },
      metrics: {
        timestamp: getTimeseriesDates(),
        data: {
          cpu: getRandomTimeseriesData(),
          memory: getRandomTimeseriesData(),
          io: getRandomTimeseriesData(),
        },
      },
    },
    dependencies: [],
  },
];

const getSameServiceAcrossEnvironments = (selectedService, services) => {
  if (selectedService) {
    const index = selectedService.indexOf('-');
    const uniqueServiceName = selectedService.substr(index + 1);
    return services.filter(service => service.name.endsWith(uniqueServiceName));
  }
  return [];
};

const filterAPMDataByServiceID = (filteredServices, apmData) => {
  const ids = filteredServices.map(service => service._id);
  const APMDataByService = {};
  ids.forEach(id => {
    APMDataByService[id] = apmData.filter(data => data.service === id);
  });
  return APMDataByService;
};

const getMetricData = apmDataPoint => ({
  cpu: apmDataPoint.cpuPercent * 100,
  memory: (apmDataPoint.memoryStats.usage / apmDataPoint.memoryStats.limit) * 100,
});

const convertAPMDataToTimeseries = (
  APMDataByService,
  selectedMetric,
) => {
  const APMDataTimeseries = {};
  Object.entries(APMDataByService).forEach(([serviceID, serviceData]) => {
    if (serviceData.length > 0) {
      const timestamps = serviceData.map(data => data.timestamp);
      const values = serviceData.map(
        data => getMetricData(data)[selectedMetric],
      );
      APMDataTimeseries[serviceID] = {
        timestamps,
        values,
      };
    }
  });
  return APMDataTimeseries;
};

const roundToZeroMilliseconds = timestamp => {
  timestamp.setMilliseconds(0);
  return timestamp;
};

const roundToZeroSeconds = timestamp => {
  roundToZeroMilliseconds(timestamp);
  timestamp.setSeconds(0);
  return timestamp;
};

const roundToZeroMinutes = timestamp => {
  roundToZeroSeconds(timestamp);
  timestamp.setMinutes(0);
  return timestamp;
};

export const dataGranularityMapping = {
  '1s': 1000,
  '10s': 10 * 1000,
  '30s': 30 * 1000,
  '1m': 60 * 1000,
  '3m': 60 * 3 * 1000,
  '5m': 60 * 5 * 1000,
  '10m': 60 * 10 * 1000,
  '20m': 60 * 20 * 1000,
  '30m': 60 * 30 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 60 * 60 * 6 * 1000,
  '12h': 60 * 60 * 12 * 1000,
  '24h': 60 * 60 * 24 * 1000,
};

const getTimestampRoundingFunctionByDataGranularity = {
  '1s': roundToZeroMilliseconds,
  '10s': roundToZeroMilliseconds,
  '30s': roundToZeroMilliseconds,
  '1m': roundToZeroSeconds,
  '3m': roundToZeroSeconds,
  '5m': roundToZeroSeconds,
  '10m': roundToZeroSeconds,
  '20m': roundToZeroSeconds,
  '30m': roundToZeroSeconds,
  '1h': roundToZeroMinutes,
  '6h': roundToZeroMinutes,
  '12h': roundToZeroMinutes,
  '24h': roundToZeroMinutes,
};

const getAggregationSpan = selectedGranularity =>
  dataGranularityMapping[selectedGranularity];

const getMeanValue = dataArray =>
  dataArray.reduce((p, c) => p + c, 0) / dataArray.length;

/**
 * Timeseries data is often displayed in certain intervals (e.g. 1 minute).
 * This functions aggregates all values that fall into a given interval and the calculate the mean value of it. The
 * result is an object of service-IDs, each containing an array of timestamps and values.
 * @param {object} dataAsTimeseries - Holding the timeseries data for each service.
 * @param {string} selectedDataGranularity - The selected data granularity as displayed in the form.
 * @return
 * {
 *   serviceID: {
 *     timestamps: [],
 *     values: [],
 *     },
 * }
 */
export const aggregateTimeseriesDataByGranularity = (
  dataAsTimeseries,
  selectedDataGranularity,
) => {
  const aggregatedAPMDataAsTimeseries = {};
  // The timespan in milliseconds for each aggregation window.
  const aggregationSpan = getAggregationSpan(selectedDataGranularity);
  // The function to round the timestamp to the correct granularity (e.g. minutes).
  const roundTimestamp =
    getTimestampRoundingFunctionByDataGranularity[selectedDataGranularity];

  // Loops through each service (service-ID & timeseries data).
  Object.entries(dataAsTimeseries).forEach(([identifier, serviceDat]) => {
    // Initialize all values for the processing of the current service.
    aggregatedAPMDataAsTimeseries[identifier] = {
      timestamps: [],
      values: [],
    };
    // eslint-disable-next-line
    const dataLength = serviceDat.timestamps.length;
    // Current & next reported timestamp define the aggregation window that is currently being processed.
    let currentReportedTimestamp = roundTimestamp(
      new Date(serviceDat.timestamps[dataLength - 1]),
    );
    let nextReportedTimestamp = new Date(
      currentReportedTimestamp - aggregationSpan,
    );
    let currentAggregationPool = [];

    // Loop through each element of the timeseries.
    // eslint-disable-next-line
    for (let i = dataLength - 1; i >= 0; i -= 1) {
      const currentTimestamp = new Date(serviceDat.timestamps[i]);
      const currentValue = serviceDat.values[i];

      /**
       * There are 3 possible decision in determining the aggregated value.
       * 1) The currently iterated value lies within the current time span (its timestamp is greater than the lower
       *    bound timestamp of the span) and gets added to aggregation pool for later mean processing.
       * 2) The currently iterated timestamp is smaller than the lower bound timestamp and the aggregation pool
       *    holds at least one value. The following things happen in that case:
       *     - A mean value is calculated.
       *     - The upper bound timestamp is pushed as the timestamp of the current aggregation step.
       *     - The mean value is pushed as the representing value of the current aggregation step.
       *     - The aggregation pool is emptied.
       *     - The upper and lower bounds of the next aggregation window are determined.
       * 3) The currently iterated timestamp is smaller than the lower bound timestamp. This might occur if there
       *    was an issue in data reporting. In that case it tries to find the next aggregation window in which the
       *    currently iterated timestamp would fit. You can think of it as skipping a hole. Afterwards it adds the
       *    data point to the aggregation pool and continues with case 1) or 2).
       */
      if (currentTimestamp > nextReportedTimestamp) {
        currentAggregationPool.push(currentValue);
      } else if (currentAggregationPool.length > 0) {
        const meanValue = getMeanValue(currentAggregationPool);

        aggregatedAPMDataAsTimeseries[identifier].timestamps.push(
          currentReportedTimestamp,
        );
        aggregatedAPMDataAsTimeseries[identifier].values.push(meanValue);

        // Reset the temporary variables.
        currentAggregationPool = [];
        currentReportedTimestamp = nextReportedTimestamp;
        nextReportedTimestamp = new Date(
          nextReportedTimestamp - aggregationSpan,
        );
        // currentAggregationPool.push(currentValue);
      }
      // Search new lower bound which is smaller than the current timestamp.
      while (currentTimestamp <= nextReportedTimestamp) {
        currentReportedTimestamp = nextReportedTimestamp;
        nextReportedTimestamp = new Date(
          nextReportedTimestamp - aggregationSpan,
        );
      }
      currentAggregationPool.push(currentValue);
    }

    // The last window might not be reported (since, in the last iteration, another value is reported to the
    // aggregation pool), therefore it has to be reported explicitly.
    if (currentAggregationPool.length > 0) {
      const meanValue = getMeanValue(currentAggregationPool);
      aggregatedAPMDataAsTimeseries[identifier].timestamps.push(
        currentReportedTimestamp,
      );
      aggregatedAPMDataAsTimeseries[identifier].values.push(meanValue);
    }
  });
  return aggregatedAPMDataAsTimeseries;
};

const mapDataByEnvironment = (APMDataAsTimeseries, services, environments) => {
  const data = {};
  const environmentIdNameMapping = {};
  environments.forEach(environment => {
    const environmentId = environment._id;
    environmentIdNameMapping[environmentId] = environment.name;
  });
  Object.entries(APMDataAsTimeseries).forEach(([serviceID, entries]) => {
    for (const service of services) {
      if (service._id === serviceID) {
        const environmentID = service.environment;
        const environmentName = environmentIdNameMapping[environmentID];
        data[environmentName] = entries;
      }
    }
  });
  return data
};

export const processAPMData = (
  selectedService,
  selectedMetric,
  selectedDataGranularity,
  services,
  apmData,
  environments,
) => {
  const sameServiceAcrossEnvironments = getSameServiceAcrossEnvironments(
    selectedService,
    services,
  );
  const APMDataByService = filterAPMDataByServiceID(
    sameServiceAcrossEnvironments,
    apmData,
  );
  const APMDataAsTimeseries = convertAPMDataToTimeseries(
    APMDataByService,
    selectedMetric,
  );
  return mapDataByEnvironment(APMDataAsTimeseries, services, environments);
};

const filterSpansByEnvironment = (
  spans,
  selectedService,
  selectedEndpoint,
  environments,
) => {
  const environmentNames = environments.map(env => env.identifier);
  const filteredSpans = environmentNames.reduce((acc, cur) => ({ ...acc, [cur]: []}), {});
  spans.forEach(span => {
    const index = span.name.indexOf('-') + 1;
    const nameWithoutEnvironment = span.name.substr(index);
    const currentEnvironment = span.name.split('-')[0];
    if (
      nameWithoutEnvironment === selectedService &&
      environmentNames.indexOf(currentEnvironment) > -1 &&
      span.tags !== null &&
      span.tags.controller_method === selectedEndpoint
    ) {
      filteredSpans[currentEnvironment].push(span);
    };
  });
  return filteredSpans;
};

const filteredSpansToTimeseries = (
  filteredSpans
) => {
  const filteredSpansAsTimeseries = {};
  Object.keys(filteredSpans).forEach(environment => {
    filteredSpansAsTimeseries[environment] = {
      timestamps: [],
      values: [],
    };
  });
  Object.entries(filteredSpans).forEach(([environment, spans]) => {
    spans.forEach(span => {
      const timestamp = new Date(span.timestamp / 1000);
      const value = span.duration;
      filteredSpansAsTimeseries[environment].timestamps.push(timestamp);
      filteredSpansAsTimeseries[environment].values.push(value);
    });
  });
  return filteredSpansAsTimeseries;
};

export const processSpanData = (
  spans,
    selectedService,
    selectedEndpoint,
    environments,
) => {
  const filteredSpans = filterSpansByEnvironment(
    spans,
    selectedService,
    selectedEndpoint,
    environments
  );
  return filteredSpansToTimeseries(filteredSpans);
};

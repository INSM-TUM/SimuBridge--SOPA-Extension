import * as openLca from "./OpenLcaConnector.js";

export const calculateCostDrivers = async (apiUrl, impactMethodId, calculationType, normalizationSetId, costDrivers, mcIterations,
  updateProgress, onSuccess, onError) => {

  try {
    const impactMethod = await openLca.getImpactMethod(apiUrl, impactMethodId);
    //let calculationType = 'lazy' //todo: lazy(default), eager, mc (monte carlo)

    let normalizedCostDrivers = [];
    console.log("calculation drivers, type:", calculationType);
    for (const el of costDrivers) {
      await (openLca.calculateCostDriver)(
        apiUrl, impactMethod, calculationType, normalizationSetId, mcIterations, el,
        (driverWeights) => {

          if(calculationType !==  'monte carlo') {
            const impactSum = driverWeights.map(i => i.amount || 0).reduce((sum, current) => sum + current, 0);
            normalizedCostDrivers.push(
              {
                id: el.id,
                name: el.name,
                category: el.category,
                cost: impactSum
              }
            );
          } else{
            normalizedCostDrivers.push(
              {
                id: el.id,
                name: el.name,
                category: el.category,
                cost: driverWeights,
                distType: "normal"
              }
             );
          }

          updateProgress((costDrivers.indexOf(el) + 2) / (costDrivers.length + 1) * 100);
        },
        (error) => onError(error)
      );
    }
    console.log("monte carlo normalizedCostDrivers:", normalizedCostDrivers);
    onSuccess(normalizedCostDrivers);
  }
  catch (error) {
    console.error('Calculate cost drivers error:', error);
    onError(error);
  }
}

export const fetchAllCostDrivers = async (apiUrl, onSuccess, onError) => {
  try {
    await openLca.getAllCostDrivers(apiUrl, onSuccess, onError);
  }
  catch (error) {
    console.error('Fetch all cost drivers error:', error);
    onError(error);
  }
};

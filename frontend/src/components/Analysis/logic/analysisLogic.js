
import {mapAbstractDriversFromConcrete} from './../../Lca/Logic/LcaDataManager';

//#region Helpers

/**
 * Maps random value in [0,1] to the drivers distribution
 * if r=-1, returns the deterministic value
 * @param {Object} driver 
 * @param {[0,1]} r random value
 * @returns 
 */
function mapToDist(driver, r) {
  // console.log("mapToDist", driver, r);
  // Check dist type, return one sample cost
 
  const cost = driver.cost; 
  const dist = driver.distType;
  // console.log("mapToDist", driver, dist, cost);  
  if (!dist) {
    // console.log("No distribution defined for", driver.name, dist)
    return driver.cost;
  }

  if (r === -1) { // in case of no random value, return deterministic value
    // console.log("No random value for", driver.name, dist)
    return driver.mean;
  }

  const { type, params } = dist;

  switch (dist) {
    case "normal": {
      // console.log("normal dist for", driver.name, dist, cost);
      // Use inverse transform sampling (approximation)
      // Simplified: convert u to standard normal (z-score)
      const z = Math.sqrt(-2 * Math.log(r)) * Math.cos(2 * Math.PI * r);
      return cost.mean + z * cost.stdDev;
    }
    case "triangular": {
        const { min, mode, max } = cost;
        const c = (mode - min) / (max - min);
        return r < c
            ? min + Math.sqrt(r * (max - min) * (mode - min))
            : max - Math.sqrt((1 - r) * (max - min) * (max - mode));
    }
    case "uniform":
      return cost.min + r * (cost.max - cost.min);
    case "deterministic": {
      return driver.mean;
    }
    default:
      console.log("Unknown distribution type:", dist);
  }

}

/**
 * Create map of all cost drivers by Id for faster finding
 * @param {*} costDrivers 
 * @returns 
 */
function getCostDriversByName(abstractCostDrivers) {
  const map = {};
  for (const abstractDriver of abstractCostDrivers) {
    if (!abstractDriver.concreteCostDrivers) continue;

    for (const concrete of abstractDriver.concreteCostDrivers) {
      concrete.dist = {}
      map[concrete.name] = concrete;
    }
  }
  return map;
}

function getConcreteCostDriverArray(abstractCostDrivers) {
  const drivers = [];
  for (const abstractDriver of abstractCostDrivers) {
    if (!abstractDriver.concreteCostDrivers) continue;
    console.log("!!!!!!!!!!!!!abstractDriver:", abstractDriver);
    for (const concrete of abstractDriver.concreteCostDrivers) {
      
      drivers.push({
        ...concrete,
        category: abstractDriver.name
      });
    }
  }
  return drivers;
}


//#region Matrix functions
function printMatrix(a) {
  a.forEach(v => console.log(...v));
}


/**
 * create a random Matrix: amount of driver x iterations with random values in [0,1]
 * @param {int} iterations 
 * @param {int} driverCount 
 * @returns 
 */
function createSampleMatrix(iterations, driverCount) {
  const matrix = [];
  for (let i = 0; i < driverCount; i++) {
    const row = [];
    for (let j = 0; j < iterations; j++) {
      row.push(Math.random().toFixed(2));  // todo: remove rounding to 2 decimal
    }
    matrix.push(row);
  }
  return matrix;
}


/**
 * 
 * @param {*} size 
 * @returns 
 */
function createIdentityRandomMatrix(size) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(i === j ? Math.random() : -1);
    }
    matrix.push(row);
  }
  return matrix;
}



function mapSampleMatrixToDistributions(sampleMatrix, drivers) {
  return sampleMatrix.map((row, driverIndex) => {
    // c#onst driverName = Object.keys(driversByName)[driverIndex];
    const driver = drivers[driverIndex];

    return row.map(rawSample => mapToDist(driver, rawSample));
  });
}


//#endregion

//#region Analysis

// todo: this function can probably be removed
// const XXrunMonteCarloSimulation = async ({
//   MC_ITERATIONS,
//   Driver,
//   simulator
// }) => {
//   const simulationResults = [];
//   for (let i = 0; i < MC_ITERATIONS; i++) {
    
//     const sampledDriver  = await getDriverSample(i, Driver);  // todo getDriverSample = get rand for every driver
//     // const result = await simulate(sampledDriver, simConfig, scenarioName, processModel, bpmn, stateReports, source, projectName);
//     const result = await simulator(sampledDriver);
//     if (result) {
//       result.sampleIndex = i;                   
//       result.sampledConfig = sampledDriver;    
//       simulationResults.push(result);
//     }
//   }
// }

//#endregion

const runSimpleMonteCarloSimulation = async ({
  MC_ITERATIONS,
  scenarioData,
  simulator
}) => {
  // console.log("[runSimpleMonteCarloSimulation] called with scenarioData", scenarioData, "and mc iterations", MC_ITERATIONS);
  const abstractCostDrivers = scenarioData.environmentImpactParameters.costDrivers;
  console.log("[runSimpleMonteCarloSimulation] abstract divers", abstractCostDrivers);
  // const drivers =  getCostDriversByName(abstractCostDrivers) 
  const drivers = getConcreteCostDriverArray(abstractCostDrivers)
  // console.log("[runSimpleMonteCarloSimulation] drivers", drivers);
  const driverCount =drivers.length;
  console.log("[runSimpleMonteCarloSimulation] called", MC_ITERATIONS, "with", driverCount ,"concrete drivers:", drivers );

  
  const sampleRandMatrix = createSampleMatrix(MC_ITERATIONS, driverCount)
  // printMatrix(sampleRandMatrix)


  const sampleMatrix = mapSampleMatrixToDistributions(sampleRandMatrix, drivers);
  console.log("[runSimpleMonteCarloSimulation] sampleMatrix", sampleMatrix);
  printMatrix(sampleMatrix)
  console.log("[runSimpleMonteCarloSimulation] drivers", drivers);

  return monteCarlo_matrix({
    sampleMatrix,
    drivers,
    simulator
  });
}

const monteCarlo_matrix = async ({
  sampleMatrix, // [driver][iteration]
  drivers,
  simulator
}) => {
  // console.log("[monteCarlo_matrix] called with drivers", drivers)
  const MC_ITERATIONS = sampleMatrix[0].length;
  const driverCount = sampleMatrix.length;
  const simulationResults = [];

  // console.log("[monteCarlo_matrix] called with", MC_ITERATIONS, "iterations and", driverCount, "drivers", drivers)
  for (let i = 0; i < MC_ITERATIONS; i++) {
    // Deep copy Driver to avoid mutating input
    // console.log("[monteCarlo_matrix] driver copy", driver)
    const sampledDrivers = JSON.parse(JSON.stringify(drivers));
    // console.log("[monteCarlo_matrix] sampledDriver copy", sampledDriver)

    for (let d = 0; d < driverCount; d++) {
      console.log("[monteCarlo_matrix] set driver", drivers[d].name, "to", sampleMatrix[d][i]);
      sampledDrivers[d].cost = sampleMatrix[d][i];
    }

    console.log("[monteCarlo_matrix] call simulator; round", i, "with", sampledDrivers);
    const abstractCostDrivers = mapAbstractDriversFromConcrete(sampledDrivers);
    console.log("[monteCarlo_matrix] Abstract sampledDrivers", abstractCostDrivers);
    const result = await simulator(abstractCostDrivers);
    if (result) {
      console.log("[monteCarlo_matrix] result", result);
      result.sampleIndex = i;
      result.sampledConfig = sampledDrivers;
      simulationResults.push(result);
    }
  }

  return simulationResults;
};


/**
 * Local sensitivity analysis
 * @param {function} simulator
 * @param {[Object]} drivers
 * @param {int} iterations per driver
 */
function localSensAnalysis(simulator, drivers, iterations) {
  // todo: loop through all drivers and simulate them oat
  const driverCount = drivers.length;
  for(let d = 0; d < driverCount; d++) {
    const driver = drivers[d];
    const samples = createSampleMatrix(iterations, driverCount);
    // todo: loop through all samples and simulate them
  }

  
}





//#region Sobol GSA




/**
 * maps each  value in[0,1] in the matrix to a distribution 
 * @param {2d matrix [[]]} A
 * @param {object} costDriversById 
 * @returns 
 */
function mapMatrixToDistribution(A, costDriversById) {
  printMatrix(A)
  const mappedA = []
  console.log("######")
  const driverKeys = Object.keys(costDriversById);
  for (let i = 0; i < A.length; i++) {
    let currentDriver = costDriversById[driverKeys[i]]
    const row = A[i].map((u, j) => {
      return mapToDist(currentDriver, u);
    });
    mappedA.push(row);
    console.log("mapping ",i )
    printMatrix(mappedA)
  }
  console.log("mapping ")
  printMatrix(mappedA)
  return mappedA;

}

/**
 * replace row j in matrixA with that row in matrixB
 * @param {*} matrixA 
 * @param {*} matrixB 
 * @param {*} j 
 * @returns 
 */
function createSobolC(matrixA, matrixB, j) {
  const C = [];
  for (let r = 0; r < matrixA.length; r++) {
    if (r === j) {
      C.push([...matrixB[r]]);  // take from B
    } else {
      C.push([...matrixA[r]]);  // keep from A
    }
  }
  return C;
}


// let mat = createSampleMatrix(3, driverCount)
// mapMatrixToDistribution(mat, costDriversById)

/**
 * 
 * @returns 
 */
function SobolGSA(iterations, driverCount, costDriversById) {
  let matrixA = createSampleMatrix(iterations, driverCount)
  let matrixB = createSampleMatrix(iterations, driverCount)

  matrixA = mapMatrixToDistribution(matrixA, costDriversById)
  matrixB = mapMatrixToDistribution(matrixB, costDriversById)

  // baseline simulations for A and B
  const resultsA = monteCarlo_matrix(matrixA);
  const resultsB = monteCarlo_matrix(matrixB);

  const sobolResults = [];
  for(let i = 0; i < driverCount; i++){
    const matrixC = createSobolC(matrixA, matrixB, i);
    const resultsC = monteCarlo_matrix(matrixC);

    sobolResults.push({
      driverIndex: i,
      resultsC,
    });
  }

   return {
    resultsA,
    resultsB,
    sobolResults,
  };
}

/**
 * first-order Sobol indices
 * @param {*} simResults 
 */
function SobolGSA_eval(simResults){

}

//#endregion

//#endregion


//#region Display

function displayOutputs() {

}

//#endregion



export {
  runSimpleMonteCarloSimulation, 
  localSensAnalysis}
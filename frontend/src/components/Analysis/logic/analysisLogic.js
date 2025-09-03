
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
      const EPS = 1e-12; // small number to avoid log(0)
      const safeR = Math.max(r, EPS);
      const z = Math.sqrt(-2 * Math.log(safeR)) * Math.cos(2 * Math.PI * safeR);
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
    // console.log("!!!!!!!!!!!!!abstractDriver:", abstractDriver);
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
      const r = Math.random();
      // Clamp away 0 to avoid log(0) issues:
      const safeR = Math.min(1 - 1e-12, Math.max(1e-12, r));
      row.push(safeR);

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

    return row.map(rawSample => {
      let r = mapToDist(driver, rawSample)
        ; if (r === Infinity) console.log("r is inf for", driver, rawSample);
      return r;
    });
  });
}


//#endregion

//#region Analysis

// todo: this function can probably be removed
// const XXrunMultipleSimulations = async ({
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
  simulator,
  stateReports
}) => {
  // console.log("[runSimpleMonteCarloSimulation] called with scenarioData", scenarioData, "and mc iterations", MC_ITERATIONS);
  const abstractCostDrivers = scenarioData.environmentImpactParameters.costDrivers;
  console.log("[runSimpleMonteCarloSimulation] abstract divers", abstractCostDrivers);
  // const drivers =  getCostDriversByName(abstractCostDrivers) 
  const drivers = getConcreteCostDriverArray(abstractCostDrivers)
  // console.log("[runSimpleMonteCarloSimulation] drivers", drivers);
  const driverCount = drivers.length;
  console.log("[runSimpleMonteCarloSimulation] called", MC_ITERATIONS, " terations, with", driverCount, "concrete drivers:", drivers);


  const sampleRandMatrix = createSampleMatrix(MC_ITERATIONS, driverCount)

  // printMatrix(sampleRandMatrix)
  console.log("[runSimpleMonteCarloSimulation] rand sampleMatrix", sampleRandMatrix);
  printMatrix(sampleRandMatrix)
  const sampleMatrix = mapSampleMatrixToDistributions(sampleRandMatrix, drivers);
  console.log("[runSimpleMonteCarloSimulation] sampleMatrix", sampleMatrix);
  printMatrix(sampleMatrix)
  console.log("[runSimpleMonteCarloSimulation] drivers", drivers);

  const results = await monteCarlo_matrix({
    sampleMatrix,
    drivers,
    simulator,
    stateReports
  });
  console.log("[runSimpleMonteCarloSimulation] complete");

  return results
}

const monteCarlo_matrixASYNC = async ({
  sampleMatrix, // [driver][iteration]
  drivers,
  simulator,
  stateReports
}) => {
  console.log("[monteCarlo_matrix] called with drivers", drivers)
  const MC_ITERATIONS = sampleMatrix[0].length;
  const driverCount = sampleMatrix.length;
  const simulationResults = [];

  // console.log("[monteCarlo_matrix] called with", MC_ITERATIONS, "iterations and", driverCount, "drivers", drivers)
  for (let i = 0; i < MC_ITERATIONS; i++) {

    const sampledDrivers = JSON.parse(JSON.stringify(drivers));
    // console.log("[monteCarlo_matrix] sampledDriver copy", sampledDrivers)

    for (let d = 0; d < driverCount; d++) {
      // console.log("[monteCarlo_matrix] set driver", drivers[d].name, "to", sampleMatrix[d][i]);
      sampledDrivers[d].cost = sampleMatrix[d][i];
    }

    // console.log("[monteCarlo_matrix] call simulator; round", i, "with", sampledDrivers);
    const abstractCostDrivers = mapAbstractDriversFromConcrete(sampledDrivers);

    const progress = (i + 1) / (MC_ITERATIONS + 1) * 100 - 1;
    console.log("[monteCarlo_matrix ] Abstract sampledDrivers", sampledDrivers, progress);
    try {
      stateReports.setStarted(progress);
    } catch (error) {
      console.log("[monteCarlo_matrix] error", error);
    }
    // stateReports.setStarted(progress);

    console.log("[monteCarlo_matrix] call simulator; ", i + 1, "of", MC_ITERATIONS, "with", abstractCostDrivers);
    const result = await simulator(abstractCostDrivers, i + 1);
    if (result) {
      console.log("[monteCarlo_matrix] !!!!!! result of", i, "with", result);
      result.sampleIndex = i;
      result.sampledConfig = sampledDrivers;
      simulationResults.push(result);
    }
  }

  console.log("[monteCarlo_matrix] simulationResults", simulationResults)
  return simulationResults;
};

const monteCarlo_matrix = async ({
  sampleMatrix, // [driver][iteration]
  drivers,
  simulator,
  stateReports
}) => {
  console.log("[monteCarlo_matrix] called with drivers", drivers);
  const MC_ITERATIONS = sampleMatrix[0].length;
  const driverCount = sampleMatrix.length;

  let completed = 0; // track finished simulations
  const simulationPromises = [];

  for (let i = 0; i < MC_ITERATIONS; i++) {
    const sampledDrivers = JSON.parse(JSON.stringify(drivers));
    for (let d = 0; d < driverCount; d++) {
      sampledDrivers[d].cost = sampleMatrix[d][i];
    }

    const abstractCostDrivers = mapAbstractDriversFromConcrete(sampledDrivers);

    const simPromise = simulator(abstractCostDrivers, i + 1)
      .then(result => {
        completed++;

        // Update progress when this simulation finishes
        const progress = (completed / MC_ITERATIONS) * 100;
        try {
          stateReports.setStarted(progress);
        } catch (error) {
          console.log("[monteCarlo_matrix] progress update error", error);
        }

        if (result) {
          if (result.error) {
            console.log("[monteCarlo_matrix] simulator error at", i, result.error, sampledDrivers, sampleMatrix);
          }
          console.log("[monteCarlo_matrix] !!!!!! result of", i, "with", result);
          result.sampleIndex = i;
          result.sampledConfig = sampledDrivers;
          return result;
        }
        return null;
      })
      .catch(err => {
        completed++;
        const progress = (completed / MC_ITERATIONS) * 100;
        try {
          stateReports.setStarted(progress);
        } catch (error) {
          console.log("[monteCarlo_matrix] progress update error", error);
        }

        console.log("[monteCarlo_matrix] simulator error at", i, err, sampledDrivers);
        return { error: err, sampleIndex: i };
      });

    simulationPromises.push(simPromise);
  }

  // Wait for all simulations to complete
  const simulationResults = await Promise.all(simulationPromises);

  console.log("[monteCarlo_matrix] simulationResults", simulationResults);
  return simulationResults.filter(Boolean); // filter out failed/null runs
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
  for (let d = 0; d < driverCount; d++) {
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
  localSensAnalysis
}

import { mapAbstractDriversFromConcrete } from './../../Lca/Logic/LcaDataManager';

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
      // Ensure the input is strictly within (0,1) to avoid edge issues
      const EPS = 1e-12;
      const safeR = Math.min(1 - EPS, Math.max(EPS, r));

      // Use the provided inverse CDF function to get standard normal
      const z = NormSInv(safeR);

      // Scale by mean and standard deviation
      return cost.mean + z * cost.stdDev;
    }
    case "triangular": {
      const { min, mode, max } = cost;
      const EPS = 1e-12;
      const safeR = Math.min(1 - EPS, Math.max(EPS, r));

      const c = (mode - min) / (max - min);
      return safeR < c
        ? min + Math.sqrt(safeR * (max - min) * (mode - min))
        : max - Math.sqrt((1 - safeR) * (max - min) * (max - mode));
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
  console.log("[getCostDriversByName] abstractCostDrivers", abstractCostDrivers);
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

/**
 * Create map of all cost drivers by Id for faster finding
 * @param {*} costDrivers 
 * @returns 
 */
function getConcreteCostDriverArray(abstractCostDrivers) {
  const drivers = [];
  for (const abstractDriver of abstractCostDrivers) {
    if (!abstractDriver.concreteCostDrivers) continue;
    // console.log("!!!!!!!!!!!!!abstractDriver:", abstractDriver);
    for (const concrete of abstractDriver.concreteCostDrivers) {

      drivers.push({
        ...concrete,
        category: abstractDriver.id
      });
    }
  }
  return drivers;
}


function NormSInv(p) {
  var a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
  var a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
  var b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
  var b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
  var c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
  var c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
  var d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
  var p_low = 0.02425, p_high = 1 - p_low;
  var q, r;
  var retVal;

  if ((p < 0) || (p > 1)) {
    alert("NormSInv: Argument out of range.");
    retVal = 0;
  }
  else if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  }
  else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return retVal;
}



//#endregion

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
  console.log("[runSimpleMonteCarloSimulation] drivers", drivers);
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

  stateReports.setStarted(1);
  stateReports.started = 1;

  const results = await monteCarlo_matrix({
    sampleMatrix,
    drivers,
    simulator,
    stateReports
  });
  if (results === "aborted") {
    console.log("[runSimpleMonteCarloSimulation] mc aborted");
    return "aborted";
  }
  console.log("[runSimpleMonteCarloSimulation] complete");

  return results
}


/**
 * Runs a set of Monte Carlo simulations with a given sample matrix and simulator
 * The sample matrix is a 2D array where each row is a driver and each column is a
 * sample of that driver. The simulator is a function that takes a set of sampled
 * drivers and returns a result (which can be null for failed simulations)
 * This function returns an array of results, where each result is either a
 * successful simulation result or an object with an 'error' property
 * @param {array} sampleMatrix - a 2D array of sampled drivers
 * @param {array} drivers - an array of driver objects
 * @param {function} simulator - a function that takes a set of sampled drivers and returns a result
 * @param {object} stateReports - an object with a 'setStarted' method for updating progress
 * @returns {array} an array of results, where each result is either a successful simulation result or an object with an 'error' property
 */
const monteCarlo_matrix = async ({
  sampleMatrix, // [driver][iteration]
  drivers,
  simulator,
  stateReports,
  progress_repeats = 1
}) => {
  // console.log("[monteCarlo_matrix] called with drivers", drivers, sampleMatrix);
  const MC_ITERATIONS = sampleMatrix[0].length;
  const driverCount = sampleMatrix.length;

  const progressPerSimulation = Math.max(0.001, 100 / (progress_repeats * MC_ITERATIONS));
  // console.log("[monteCarlo_matrix] progressPerSimulation", progressPerSimulation, progress_repeats, MC_ITERATIONS, stateReports.started, drivers);
  let completed = 0; // track finished simulations
  const simulationPromises = [];

  for (let i = 0; i < MC_ITERATIONS; i++) {
    if (stateReports.started === -1)
      return "aborted";
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
        console.log("[monteCarlo_matrix] progress", completed, progress, stateReports.started, progressPerSimulation, stateReports.started + progressPerSimulation,);
        try {
          stateReports.started = stateReports.started + progressPerSimulation
          stateReports.setStarted(stateReports.started);
        } catch (error) {
          console.log("[monteCarlo_matrix] progress update error", error);
        }

        if (result) {
          if (result.error) {
            console.log("[monteCarlo_matrix] simulator error at", i, result.error, sampledDrivers, sampleMatrix);
          }
          // console.log("[monteCarlo_matrix] !!!!!! result of", i, "with", result);
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
          stateReports.setStarted(stateReports.started);
          stateReports.started = stateReports.started + progressPerSimulation
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

  // console.log("[monteCarlo_matrix] simulationResults", simulationResults);
  return simulationResults.filter(Boolean); // filter out failed/null runs
};


//#region Sensitivity Analysis
/**
 * Local sensitivity analysis
 * @param {function} simulator
 * @param {[Object]} drivers
 * @param {int} iterations per driver
 */
const localSensAnalysis = async ({
  MC_ITERATIONS,
  scenarioData,
  simulator,
  stateReports
}) => {

  const abstractCostDrivers = scenarioData.environmentImpactParameters.costDrivers;
  const drivers = getConcreteCostDriverArray(abstractCostDrivers)
  const driverCount = drivers.length;
  const sampleRandMatrix = createSampleMatrix(MC_ITERATIONS, driverCount);

  stateReports.setStarted(1);
  stateReports.started = 1;

  const allResults = [];
  const baselineMatrix = drivers.map(d => Array(1).fill(d.cost.mean)); // create baseline matrix with all deterministic
  console.log("[runLocalSensitivityAnalysis] baselineMatrix", baselineMatrix, drivers);
  const baselineResults = await monteCarlo_matrix({
    sampleMatrix: baselineMatrix,
    drivers,
    simulator,
    stateReports,
    progress_repeats: driverCount + 0.1
  });
  console.log("[runLocalSensitivityAnalysis] baselineResults", baselineResults);

  allResults.push({
    d: -1,
    driverName: "baseline",
    baselineResults: baselineResults[0],
    drivers
  });
  stateReports.started = 1;
  stateReports.setStarted(1);

  for (let d = 0; d < driverCount; d++) {
    const currDriver = drivers[d];
    console.log(`[runLocalSensitivityAnalysis] Analyzing driver ${d}: ${currDriver.name}`);


    const sampleMatrix = createSensitivitySampleMatrixMapping(sampleRandMatrix, d, drivers);
    console.log("[analysisLogic] localSA sampleMatrix", sampleMatrix, drivers);
    const results = await monteCarlo_matrix({
      sampleMatrix,
      drivers,
      simulator,
      stateReports,
      progress_repeats: driverCount + 1,  // to scale progress
    });

    if (results === "aborted" || stateReports.started === -1) {
      console.log("[runLocalSensitivityAnalysis] lsa aborted");
      return "aborted";
    }

    allResults.push({
      d,
      driverName: currDriver.name,
      results,
      sampleMatrix
    });
    console.log(`[runLocalSensitivityAnalysis] Progress: ${d+1}/${driverCount}`);


  }
  console.log("[runLocalSensitivityAnalysis] complete");
  return allResults;


}

/**
 * Maps one row of the sampleRandMatrix to a distribution and the other rows to their deterministic value/mean
 * @param {2d matrix [[]]} sampleRandMatrix
 * @param {Object} currDriver
*/
const createSensitivitySampleMatrixMapping = (sampleRandMatrix, varyingDriverIndex, drivers) => {
  const MC_ITERATIONS = sampleRandMatrix[0].length;
  const driverCount = drivers.length;

  const lsaSampleMatrix = [];
  for (let i = 0; i < driverCount; i++) {

    if (i === varyingDriverIndex) {
      // Vary this driver using its distribution
      const variedDriver = drivers[i];
      const variedSamples = sampleRandMatrix[i].map(r => mapToDist(variedDriver, r));

      lsaSampleMatrix.push(variedSamples);
    } else {
      // Fix other drivers at their mean values
      const meanValue = drivers[i].cost.mean;
      lsaSampleMatrix.push(Array(MC_ITERATIONS).fill(meanValue));

    }

  }
  if (true) { //(varyingDriverIndex == 1){
    console.log("lsaSampleMatrix for driver", varyingDriverIndex, ":", sampleRandMatrix, lsaSampleMatrix, drivers);
  }
  return lsaSampleMatrix;
}
//#endregion

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
    console.log("mapping ", i)
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
const runSobolGSA = async ({ iterations, abstractDrivers, simulator, stateReports }) => {
  console.log("[runSobolGSA] called with abstractDrivers", abstractDrivers, "and iterations", iterations);
  const drivers = getConcreteCostDriverArray(abstractDrivers)
  const driverCount = drivers.length;
  console.log("[runSobolGSA] called with drivers", drivers, driverCount, "and iterations", iterations);

  let matrixA = createSampleMatrix(iterations, driverCount)
  let matrixB = createSampleMatrix(iterations, driverCount)

  matrixA = mapMatrixToDistribution(matrixA, drivers)
  matrixB = mapMatrixToDistribution(matrixB, drivers)

  stateReports.setStarted(1);
  stateReports.started = 1;

  console.log("Sobol GSA with matrixA", matrixA, "and matrixB", matrixB);

  // baseline simulations for A and B
  const resultsA = await monteCarlo_matrix({
    sampleMatrix: matrixA,
    drivers, simulator, stateReports,
    progress_repeats: driverCount + 2
  });
  const resultsB = await monteCarlo_matrix({
    sampleMatrix: matrixB,
    drivers, simulator, stateReports,
    progress_repeats: driverCount + 2
  });
  if (resultsA === "aborted" || resultsB === "aborted" || stateReports.started === -1) {
    console.log("[runLocalSensitivityAnalysis] lsa aborted");
    return "aborted";
  }

  console.log("Sobol GSA with base results", resultsA, resultsB);

  const sobolResults = [];
  for (let i = 0; i < driverCount; i++) {
    console.log(`[runLocalSensitivityAnalysis] Start Progress: ${i + 1}/${driverCount}`);
    const matrixC = createSobolC(matrixA, matrixB, i); //replace row i from A with that from B
    const resultsC = await monteCarlo_matrix({   // simulate matrix C
      sampleMatrix: matrixC,
      drivers,
      simulator,
      stateReports,
      progress_repeats: driverCount + 2,
    });

    if (resultsC === "aborted" || stateReports.started === -1) {
      console.log("[runLocalSensitivityAnalysis] lsa aborted");
      return "aborted";
    }

    sobolResults.push({
      driverIndex: i,
      results: resultsC,
      driverName: drivers[i].name,
    });

  }

  return {
    aMatrix: resultsA,
    bMatrix: resultsB,
    sobolResults,
  };
}

/**
 * first-order Sobol indices
 * @param {*} simResults 
 */
function SobolGSA_eval(simResults) {

}

//#endregion

//#endregion


//#region Display

function displayOutputs() {

}

//#endregion


//#region Exported functions
export {
  runSimpleMonteCarloSimulation,
  localSensAnalysis,
  getConcreteCostDriverArray,
  runSobolGSA
}





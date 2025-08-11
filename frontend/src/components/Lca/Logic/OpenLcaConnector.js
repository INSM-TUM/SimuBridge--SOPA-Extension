import * as o from "olca-ipc";
const ss = require('simple-statistics');


export const getAllImpactMethods = async (apiUrl) => {
    const client = new o.IpcClient.on(apiUrl);
    const impactMethods = await client.getAll(o.RefType.ImpactMethod);
    console.log('All Impact Methods:', impactMethods);
    return impactMethods;
}

export const getImpactMethod = async (apiUrl, impactMethodId) => {
    const client = new o.IpcClient.on(apiUrl);
    const impactMethod = await client.get(
        o.RefType.ImpactMethod,
        { id: impactMethodId, refType: o.RefType.ImpactMethod });
        console.log('Impact Method:', impactMethod);
    return impactMethod;
}

export const getAllCostDrivers = async (apiUrl, onSuccess, onError) => {
    try {
        const client = new o.IpcClient.on(apiUrl);
        const systems = await client.getAll(o.RefType.ProductSystem);
        console.log('Systems:', systems);
        onSuccess(systems);
    }
    catch (error) {
        console.error('API Error:', error);
        onError(error);
    }
}

const EPSILON = 1e-15;
export const calculateCostDriver = async (apiUrl, impactMethod, calculationType, normalizationSetId, mcIterations,
    targetDriver, onSuccess, onError) => {
    // console.log("[calculate Cost Drivers] calculation type: ", calculationType)
    if (calculationType === 'lazy') {
    try {
        const client = new o.IpcClient.on(apiUrl);
        let normalizationSet = normalizationSetId && impactMethod.nwSets.filter(set => set.id == normalizationSetId)[0];
        let calcSetup = await o.CalculationSetup.of({
            target: targetDriver,
            impactMethod: impactMethod,
            nwSet: normalizationSet,
            allocation: o.AllocationType.USE_DEFAULT_ALLOCATION,
            withCosts: false,
            withRegionalization: false,
            amount: targetDriver.targetAmount,
            unit: targetDriver.targetUnit
        });

        const result = await client?.calculate(calcSetup);

        if (!result) {
            console.log("calculation failed: no result retrieved");
        }
        const s = await result.untilReady();
        if (s.error) {
            console.log(s.error);
        }

        const driverWeights = await result.getWeightedImpacts();
        console.log('Driver Weights:', driverWeights);

        onSuccess(driverWeights);
    }
    catch (error) {
        console.error('API Error:', error);
        onError(error);
    }
    } else if (calculationType === 'monte carlo') {
        try {
            let normalizationSet = normalizationSetId && impactMethod.nwSets.filter(set => set.id == normalizationSetId)[0];
           
            let results = await monteCarloJs(apiUrl, targetDriver, impactMethod, normalizationSet, mcIterations) // todo: add iterations dynamically
            for (let i = 0; i < results.length; i++) {
                // console.log("mc item:", results[i]);
                const impactSum = results[i].map(i => i.amount || 0).reduce((sum, current) => sum + current, 0);
                results[i] = impactSum;
            }
            console.log('Monte carlo folded results of', targetDriver.name, ":", results);
            if (!results) {
                console.log("calculation failed: no result retrieved");
            }

             // Sort for median and min/max
            const sorted = [...results].sort((a, b) => a - b);
            const n = results.length;

            // Mean
            const mean = results.reduce((sum, x) => sum + x, 0) / n;

            // Median
            const median = n % 2 === 0
                ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
                : sorted[Math.floor(n / 2)];

            // Variance
            const variance = results.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;

            // Min/Max
            const min = sorted[0];
            const max = sorted[n - 1];

            // Standard Deviation
            let stdDev = 0;
            if (min != max) {
                stdDev = Math.sqrt(variance);
            }

            const mode = ss.mode(sorted);

            const mcEval = {
                mean: mean,
                median: median,
                stdDev: stdDev,
                min: min,
                max: max,
                mode: mode
            }

            if(stdDev < EPSILON) {
                mcEval.distType = "deterministic";
            }else{
                const distributions = fitDistributions(results);
                console.log("Fitted distributions:", distributions);
            }


            // console.log('Monte Carlo Evaluation:', mcEval);

            onSuccess(mcEval);

        }
        catch (error) {
            console.error('API Error:', error);
            onError(error);
        }
    }
}

function transposeArray(a) {
    if (!Array.isArray(a) || a.length === 0) return [];
    return a[0].map((_, colIndex) => a.map(row => row[colIndex]));
}


async function monteCarloJs(apiUrl, targetDriver, impactMethod, normalizationSet,
    iterations = 10) {
    let replacement_impactCathegory = {id: "f3138c2e-ea9c-305a-adf6-65e692e5b761"} //todo: replace with the actual impact cathegory; the lazy one doesnt work
    const client = new o.IpcClient.on(apiUrl);
    // schedule a first iteration
    // console.log("[mc] start", targetDriver.id)
    let calcSetup = o.CalculationSetup.of({
        target: targetDriver,
        impactMethod: impactMethod,
        nwSet: normalizationSet,
        allocation: o.AllocationType.USE_DEFAULT_ALLOCATION,
        withCosts: false,
        withRegionalization: false
    });

    
    let simulator = await client.simulate(calcSetup);

    let xs = [];
    //let indicatorId; // track one category ID


    for (let i = 0; i < iterations; i++) {
        // console.log(`Iteration ${i + 1}`);

        await simulator.simulateNext();
        const impactResults = await simulator.getTotalImpacts();

        // todo: choose the impact cathegory beforehand?? e.g. climate change, pollution, etc.
      
        // Find the impact item corresponding to the tracked indicator ID
        // const item = impactResults.find(ir => ir.impactCategory.id === replacement_impactCathegory.id);
        // console.log("Monte Carlo item:", item);
        if (impactResults) {

            xs.push(impactResults); // Add the value to our results array
        } else {
            console.log(`no impact values found in iteration ${i + 1}`);
        }
    }

    // Dispose of the simulator to release resources
    await simulator.dispose();
    
    console.log("[mc] ctdriver name:", xs);
    // if (targetDriver.name === "a_concrete_b") {
    //     replacement_impactCathegory = "f3138c2e-ea9c-305a-adf6-65e692e5b761"
    //     xs = transposeArray(xs)
    //     console.log("[mc] finished. Collected values:",replacement_impactCathegory, xs);
    //     for (let i = 0; i < xs.length; i++) {
    //          console.log("mc item:", xs[i][0].impactCategory.id);
    //          if ( xs[i][0].impactCategory.id === replacement_impactCathegory )
    //             console.log("YES!!!", i)
    //     }
    //     // const item = xs.find(ir => ir[0].impactCategory.id === replacement_impactCathegory.id);
    //     // console.log("Monte Carlo item:", item);
    // }

    return xs; // Return the collected values
}
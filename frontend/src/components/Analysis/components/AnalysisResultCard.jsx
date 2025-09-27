import { useMemo } from "react";
import { useEffect, useState } from "react";
import React from "react";
import { Flex, Heading, SimpleGrid, Card, CardHeader, CardBody, Text, Select, Stack, Button, Progress, Box, Textarea, UnorderedList, ListItem, Grid, Divider } from '@chakra-ui/react';
import { BarChart } from '@mui/x-charts/BarChart';
import { createTheme, ThemeProvider } from "@mui/material";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { getFiles, getFile } from "../../../util/Storage.js";
import { AnalysisResultDiagrams } from "./AnalysisResultDiagrams.jsx";
import { ConfidenceChart } from "./ConfidenceChart.jsx";
import TornadoChart from "./TornadoChart.jsx";


// XML Parser vorbereiten
const parser = new DOMParser();

// todo remove test data:
const testCosts = [1.2, 2.3, 2.5, 3.1, 2.9, 4.0, 3.5, 2.8, 3.3, 4.1, 5.0, 3.8, 4.5, 2.7, 3.9];
const testStats = stats(testCosts);

// response: array of Monte Carlo run results
export default function AnalysisResultCard({ response, projectName, drivers }) {

    const runs = response.runs || [];
    if (!response.analysisName) response.analysisName = "Error: unknown analysis";
    // const runsX = Array.isArray(runs) ? runs : runs ? [runs] : [];
    console.log("[AnalysisResultCard] parra", projectName, response, runs, drivers);
    // console.log("AnalysisResultCard runsX:", runsX);

    console.log("[Output Diagramms] Runs ", runs, projectName);
    const [allRuns, setAllRuns] = useState([]);
    const [deterministic, setDeterministic] = useState([]);
    const [analysisResults, setAnalysisResults] = useState([]);

    //#region initiate processing
    // runs verarbeiten, sobald Komponente gerendert wurde
    React.useEffect(() => {
        async function processRuns() {
            if (response.analysisName === "monte carlo" || response.analysisName === "deterministic") {
                await processMCRuns(runs, projectName, setDeterministic, setAnalysisResults);
                console.log("AnalysisResultCard runs processed MC");

            } else if (response.analysisName === "local SA") {
                await processLSARuns(runs, projectName, setAnalysisResults, drivers);
                console.log("AnalysisResultCard runs processed LSA");
            } else if (response.analysisName === "sobol GSA") {
                await processSobolRuns(runs, projectName, setAnalysisResults, drivers);
                console.log("AnalysisResultCard runs processed Sobol GSA");
            }
            else {
                console.log("Unknown analysis type:", response.analysisName);
            }
        }


        processRuns();
    }, [runs]);
    //#endregion

    React.useEffect(() => {
        // console.log("Deterministic updated:", deterministic);
        console.log("[AnalysisResultCard] Non-Deterministic updated:", analysisResults);
    }, [deterministic, analysisResults]);
    const theme = createTheme();


    //#region Render Return
    return (
        <Card bg="white">
            <CardHeader>
                <Heading size='md'>Analysis Results ({response.analysisName} {formatDuration(response.durationMs)})</Heading>
            </CardHeader>
            <CardBody>
                <Flex direction="column" gap={6}>
                    {response.analysisName === "monte carlo" || response.analysisName === "deterministic" ? (
                        <div>
                            {/* Deterministic Activities Section */}
                            {deterministic.length > 0 && (
                                <Box flex={1} sx={{ minWidth: 212 }}>
                                    <Text fontWeight="bold">Deterministic Activities</Text>
                                    <UnorderedList> {/* ml-4 aligns bullets nicely under heading */}
                                        {deterministic.map(({ name, cost }) => (
                                            <ListItem key={name}>
                                                <Text>
                                                    <Text as="span" fontWeight="semibold" color="gray.500">
                                                        {`${name.replace(/_/g, " ")}: `}
                                                    </Text>
                                                    {cost.toFixed(3)}
                                                </Text>
                                            </ListItem>
                                        ))}
                                    </UnorderedList>

                                </Box>
                            )}


                            {/* Divider - only show if BOTH sections have content */}
                            {deterministic.length > 0 && analysisResults.length > 0 && (
                                <Divider />
                            )}

                            {/* Distributed  Activity Costs Section */}
                            {analysisResults.length > 0 && (
                                <Box flex={1}>
                                    <Text fontWeight="bold" mb={2}>Distribution per Activity</Text>
                                    {/* <AnalysisResultDiagrams activity={"testA"} costs={testCosts} stats={testStats} /> */}
                                    <SimpleGrid
                                        minChildWidth="400px"
                                        spacing={4}
                                    >
                                        {analysisResults.map(({ name, stats, costs }) => (
                                            <AnalysisResultDiagrams key={name} activity={name} costs={costs} stats={stats} />
                                        ))}
                                    </SimpleGrid>

                                    {/* Additional Charts Section */}
                                    <Box mt={6} h="min-content" >

                                        <Text fontWeight="bold" mb={2}>Comparison of Activities</Text>
                                        <Box display="flex" gap={6}>



                                            <Box w="25%" h="250px">
                                                <Text fontWeight="bold" mb={2}>Standard Error of the Mean (SEM) per Activity</Text>
                                                <ThemeProvider theme={theme}>
                                                    <SimpleBarChart results={analysisResults.reduce((acc, a) => {
                                                        acc[truncatedString(a.name.replaceAll(/_/g, " "))] = a.stats.sem;
                                                        return acc;
                                                    }, {})} />
                                                    {/* <BarChart
                                                        xAxis={[
                                                            {
                                                                data: truncatedData(analysisResults.map(a => a.name.replaceAll(/_/g, " "))),
                                                                scaleType: "band",
                                                                tickLabelStyle: {
                                                                    angle: -35, // Rotates labels by -45 degrees
                                                                    textAnchor: 'end', // Aligns the text to the end of the label
                                                                    fontSize: 10, // Optional: Adjust font size for better fit
                                                                },
                                                            },
                                                        ]}
                                                        series={[
                                                            {
                                                                data: analysisResults.map(a => a.stats.sem),
                                                                name: "SEM",
                                                                minBarSize: 2, // Ensures a minimum bar height of 2 pixels
                                                            },
                                                        ]}
                                                        margin={{
                                                            bottom: 100, // Adjust this value as needed
                                                        }}
                                                    /> */}
                                                </ThemeProvider>
                                            </Box>


                                            <Box w="25%" h="350px">
                                                <Text fontWeight="bold" mb={2}>Mean Costs with 95% Confidence Interval per Activity</Text>
                                                <ConfidenceChart activityData={analysisResults} isDarkMode={false} />
                                            </Box>
                                        </Box>


                                    </Box></Box>
                            )}
                        </div>
                    ) : response.analysisName === "local SA" ? (
                        <Box>
                            <Text fontWeight="bold" mb={2}>Sensitivities general stats</Text>
                            {/* <Text mb={4}>Only activities with non-zero sensitivity are shown. {JSON.stringify(getDriversWithValue(analysisResults.sensitivitiesPerActivity))} ah</Text> */}
                            {/* <Text mb={4}>Aaaah.  {JSON.stringify(analysisResults.overallSensitivities)}</Text> */}
                            <Box w="22%" h="250px">
                                {analysisResults.overallSensitivities !== undefined && Object.keys(analysisResults.overallSensitivities).length > 0 &&
                                    <TornadoChart  {... { sensitivityValues: analysisResults.overallSensitivities, darkMode: false, name: "Overall Costs" }} />
                                }
                            </Box>
                            <Divider />

                            <Text fontWeight="bold" mb={2}>Sensitivities per Activity </Text>
                            <Flex wrap="wrap" gap={6} mt={6}>
                                {Object.entries(getDriversWithValue(analysisResults.sensitivitiesPerActivity)).map(([driverName, value]) => (

                                    <Box w="22%" h="250px" key={driverName} mb={6} >
                                        {/* <Text mb={4}>UUHH.  {JSON.stringify(value)}</Text> */}

                                        <TornadoChart {...{ sensitivityValues: value, darkMode: false, name: driverName.replaceAll(/_/g, " ") }} />
                                    </Box>
                                ))}

                            </Flex>
                        </Box>
                    ) : response.analysisName === "sobol GSA" ? (

                        <Box>
                            <Text fontWeight="bold" mb={2}>First Order Indices per Activity </Text>
                            {analysisResults.firstOrder !== undefined && <Flex wrap="wrap" gap={6} mt={6}>
                                {
                                    Object.entries(analysisResults.firstOrder).map(([activityName, activitiesDrivers]) => (

                                        <Box w="20%" h="250px">
                                            <Text fontWeight="medium" mb={2}>{activityName.replaceAll(/_/g, " ")}</Text>
                                            <ThemeProvider theme={theme}>
                                                <SimpleBarChart results={activitiesDrivers} />
                                            </ThemeProvider>
                                        </Box>
                                    ))
                                }
                            </Flex>
                            }

                            <Divider mt={6} mb={6} />

                            <Text fontWeight="bold" mb={2}>Total Order Indices per Activity </Text>
                            {analysisResults.totalOrder !== undefined && <Flex wrap="wrap" gap={6} mt={6}>
                                {
                                    Object.entries(analysisResults.totalOrder).map(([activityName, activitiesDrivers]) => (

                                        <Box w="20%" h="250px">
                                            <Text fontWeight="medium" mb={2}>{activityName.replaceAll(/_/g, " ")}</Text>
                                            <ThemeProvider theme={theme}>
                                                <SimpleBarChart results={activitiesDrivers} />
                                            </ThemeProvider>
                                        </Box>
                                    ))
                                }
                            </Flex>
                            }

                        </Box>
                    ) : (
                        <Text>Unknown analysis type: {response.analysisName}</Text>
                    )

                    }


                </Flex>
            </CardBody>

        </Card>
    );
    //#endregion
}


async function extractActivityCostsOld(run, projectName) {
    // console.log("Extracting activity costs from run:", run, projectName);
    const statFileName = run.files.find((f) => f.endsWith("_statistic.xml"));
    // console.log("Statistic file name:", statFileName);
    if (!statFileName) return {};
    const filePath = (run.requestId ? run.requestId + "/" : "") + statFileName;

    // console.log("Found stat file:", statFileName, filePath);
    const fileData = await getFile(projectName, filePath);
    // console.log("File data length:", fileData.data?.length);
    const fileXml = parser.parseFromString(fileData.data, "text/xml");
    // console.log("Parsed XML:", fileXml);

    const activityContainers = fileXml.getElementsByTagName("Activity_Instance_Cost");
    const runCosts = {};

    for (const container of activityContainers) {
        const activities = container.getElementsByTagName("Activity");
        for (const activity of activities) {
            const activityId = activity.getAttribute("id");
            if (!activityId) continue;

            const costVariants = activity.getElementsByTagName("Cost_Variant");
            const costs = [];
            const avgCost = activity.getElementsByTagName("Average_Cost");
            costs.push(avgCost);

            for (const variant of costVariants) {
                const instances = variant.getElementsByTagName("activity_instance_cost");
                for (const inst of instances) {
                    const costValue = parseFloat(inst.textContent);
                    if (!isNaN(costValue)) costs.push(costValue);
                }
            }

            if (costs.length > 0) runCosts[activityId] = costs;
        }
    }

    return runCosts;
}

async function extractActivityCosts(run, projectName) {
    const statFileName = run.files.find((f) => f.endsWith("_statistic.xml"));
    if (!statFileName) return {};

    const filePath = (run.requestId ? run.requestId + "/" : "") + statFileName;
    const fileData = await getFile(projectName, filePath);
    console.log("File data length:", fileData);
    const fileXml = parser.parseFromString(fileData.data, "text/xml");

    const activityContainers = fileXml.getElementsByTagName("Activity_Cost");
    const runCosts = {};

    for (const container of activityContainers) {
        const activities = container.getElementsByTagName("Activity");
        for (const activity of activities) {
            const activityId = activity.getAttribute("id");
            if (!activityId) continue;

            const avgCostElem = activity.getElementsByTagName("Activity_Average_Cost")[0];
            if (!avgCostElem) continue;

            const costValue = parseFloat(avgCostElem.textContent);
            if (!isNaN(costValue)) runCosts[activityId] = costValue;
        }
    }

    return runCosts;
}


/* Aggregate costs per activity across all runs */
/**
 * 
 * @param {*} data {run:{costs:{activities} }}
 * @returns 
 */
function aggregateCosts(runs) {
    const result = {};

    runs.forEach(run => {
        const costs = run.costs;
        for (const activity in costs) {
            if (!result[activity]) result[activity] = [];
            result[activity].push(costs[activity]); // <— directly push the number
        }
    });

    return result;
}


/** Aggregate total costs across all activities per driver */
function aggregateOverallDriverCostsXX(resultsPerDriver) {
    console.log("[aggregateOverallDriverCosts] Results per driver:", resultsPerDriver);
    const result = {};

    for (const [driver, data] of Object.entries(resultsPerDriver)) {
        const costs = data.costs; // this is { activity: number, ... }
        const totalCost = Object.values(costs).reduce((sum, c) => sum + c, 0);
        result[driver] = totalCost;
    }

    console.log("[aggregateOverallDriverCosts] Overall driver costs:", result);
    return result;
}

function aggregateOverallDriverCosts(drivers) {
    const result = {};

    for (const driver in drivers) {
        const activities = drivers[driver].costs;
        const activityNames = Object.keys(activities);
        if (activityNames.length === 0) continue;

        // Assume all arrays are same length
        const numRuns = activities[activityNames[0]].length;
        const totalPerRun = Array(numRuns).fill(0);

        // Sum costs per run across activities
        for (const activity of activityNames) {
            const costs = activities[activity];
            for (let i = 0; i < numRuns; i++) {
                totalPerRun[i] += costs[i];
            }
        }

        // Calculate mean across runs
        const meanTotal = totalPerRun.reduce((a, b) => a + b, 0) / numRuns;
        result[driver] = meanTotal;
    }

    console.log("[aggregateOverallDriverCosts] Overall driver costs:", result);
    return result;
}


function stats(arr) {
    const n = arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const deterministic = min === max;
    const mean = arr.reduce((s, v) => s + v, 0) / n;
    const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stdev = Math.sqrt(variance);
    let sem = NaN;
    if (n > 1) sem = stdev / Math.sqrt(n);
    const confInterval = calculateConfidenceInterval(mean, stdev, n);

    return { count: n, mean, variance, stdev, min, max, deterministic, sem, confInterval };
}

function formatDuration(durationMs, includeFractional = false) {
    if (durationMs === undefined || durationMs === null) return "time: N/A";
    const totalSeconds = durationMs / 1000;
    console.log("ARC: formatDuration", durationMs, totalSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = includeFractional
        ? (totalSeconds % 60).toFixed(2)
        : Math.floor(totalSeconds % 60);

    if (minutes === 0) return `${seconds} sec`;
    else return `${minutes} min ${seconds} sec`;
}



//#region Processing Functions
async function processMCRuns(runs, projectName, setDeterministic, setAnalysisResults) {
    const allRuns = [];
    for (const run of runs) {
        // console.log("Processing run:", run.requestId, run);
        if (run.error) continue;
        const runCosts = await extractActivityCosts(run, projectName);
        // console.log("Run costs:", runCosts);
        allRuns.push({
            requestId: run.requestId,
            costs: runCosts
        });
    }
    console.log("[Output Diagramms] All Runs ", allRuns);
    const perActivityCosts = aggregateCosts(allRuns);
    console.log("[Output Diagramms] Per Activity Costs ", perActivityCosts);
    const activityStats = Object.fromEntries(Object.entries(perActivityCosts).map(([activity, values]) => [activity, stats(values)]))
    // console.log("[Output Diagramms] Activity Stats ", activityStats);

    const det = [];
    const nonDet = [];

    for (const [activity, s] of Object.entries(activityStats)) {
        if (s.deterministic) det.push({ name: activity, cost: s.mean });
        else {
            const values = perActivityCosts[activity];
            console.log("[Output Diagramms] Activity", activity, "values", values);
            nonDet.push({ name: activity, stats: s, costs: values });
        }
    }

    setDeterministic(det);
    setAnalysisResults(nonDet);
}



async function processLSARuns(results, projectName, setAnalysisResults, drivers) {
    const baselineDriver = results.find(driver => driver.driverName === 'baseline');
    // console.log("processLSARuns baselineDriver", baselineDriver, projectName);
    let baseCosts = await extractActivityCosts(baselineDriver.baselineResults, projectName); // change this immediatly in analysis logic
    baseCosts = aggregateCosts([{ costs: baseCosts }]);
    // Filter out the baseline object to create a new array
    const runs = results.filter(driver => driver.driverName !== 'baseline');
    console.log("processLSARuns", runs, projectName);

    const runsPerDriver = {};
    const resultsPerDriver = {};
    for (let idx = 0; idx < runs.length; idx++) { // iterate over each varied driver's runs
        const driver = runs[idx];
        // console.log("Processing lsa driver runs:", driver, projectName);
        runsPerDriver[driver.driverName] = [];
        for (const run of driver.results) {
            // console.log("Processing run:", run.requestId, run);
            if (run.error) continue;

            const runCosts = await extractActivityCosts(run, projectName);
            // console.log("Run costs:", runCosts);
            runsPerDriver[driver.driverName].push({
                requestId: run.requestId,
                costs: runCosts
            });
        }
        const aggCosts = aggregateCosts(runsPerDriver[driver.driverName]);
        console.log("[Output Diagramms] Per Activity Costs ", runsPerDriver[driver.driverName], Object.entries(runsPerDriver[driver.driverName]));
        const activityStats = Object.fromEntries(Object.entries(aggCosts).map(([activity, values]) => [activity, stats(values)]))
        const activitySensitivities = computeActivitySensitivities(baseCosts, activityStats);
        resultsPerDriver[driver.driverName] = { "costs": aggCosts, "stats": activityStats, "sensitivities": activitySensitivities };

    }
    runsPerDriver["baseline"] = baseCosts;
    console.log("[ARC] All LSA Runs ", runsPerDriver, resultsPerDriver);

    const overallCosts = aggregateOverallDriverCosts(resultsPerDriver);
    const baselineOverallCosts = Object.values(baseCosts).map(arr => arr.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    console.log("[ARC] Baseline Overall Costs ", baseCosts, baselineOverallCosts, overallCosts);

    // overallCosts.mapValues(c => c - baselineOverallCosts);
    const overallSensitivities = Object.fromEntries(
        Object.entries(overallCosts).map(([driver, value]) => [driver, value - baselineOverallCosts])
    );

    const scaled_overallSensitivities = Object.fromEntries(
        Object.entries(overallCosts).map(([driver, value]) => {
            const driverMean = drivers[driver]?.costs
                ? Object.values(drivers[driver].costs).flat().reduce((a, b) => a + b, 0) / Object.values(drivers[driver].costs)[0].length
                : 1; // fallback to avoid division by 0
            return [driver, (value - baselineOverallCosts) / driverMean];
        })
    );

    console.log("[ARC] Overall Costs per Driver ", overallCosts, baselineOverallCosts, overallSensitivities, scaled_overallSensitivities);

    const sensitivitiesPerActivity = reverseMapping(resultsPerDriver, "sensitivities");
    console.log("[ARC] Sensitivities per Activity ", sensitivitiesPerActivity, getDriversWithValue(sensitivitiesPerActivity));
    setAnalysisResults({ resultsPerDriver, sensitivitiesPerActivity, overallSensitivities });

}

/**
 * Processes Sobol GSA results to compute first-order and total-order indices.
 * @param {object} results - The complete results object from the Sobol simulation.
 * @param {string} projectName - The name of the project for file fetching.
 * @param {Function} setAnalysisResults - State setter to store the computed indices.
 * @param {Array<object>} drivers - The list of driver variables.
 */
export async function processSobolRuns(results, projectName, setAnalysisResults, drivers) {
    if (!results || !results.aMatrix || !results.bMatrix || !results.sobolResults) {
        console.error("Invalid results object provided for Sobol analysis.");
        return;
    }
    console.log("Starting Sobol GSA processing...", results);

    // Process A and B matrices to get activity costs.
    const costsA = await processMatrix(results.aMatrix, projectName);
    const costsB = await processMatrix(results.bMatrix, projectName);

    // Process A_iB matrices for each driver.
    const costsAiB = {};
    for (const sobolResult of results.sobolResults) {
        costsAiB[sobolResult.driverName] = await processMatrix(sobolResult.results, projectName);
    }

    console.log("Extracted costs from all matrices.", { costsA, costsB, costsAiB });


    const firstOrderIndices = {};
    const totalOrderIndices = {};
    const allActivities = new Set([...Object.keys(costsA), ...Object.keys(costsB)]);

    // Compute Sobol indices for each activity
    for (const activity of allActivities) {
        if (!costsA[activity] || !costsB[activity]) {
            console.warn(`Skipping activity '${activity}' due to missing data in A or B matrix.`);
            continue;
        }

        const numRuns = costsA[activity].length;
        if (numRuns === 0) continue;

        // Calculate the total variance of the combined A and B matrices.
        const totalVariance = stats([...costsA[activity], ...costsB[activity]]).variance;

        if (totalVariance === 0) {
            console.warn(`Total variance is zero for activity '${activity}'. Skipping Sobol index calculation.`);
            continue;
        }

        firstOrderIndices[activity] = {};
        totalOrderIndices[activity] = {};

        for (const driver of drivers) {
            const driverName = driver.name;
            const costsForDriver = costsAiB[driverName];
            if (!costsForDriver || !costsForDriver[activity]) {
                console.warn(`Skipping driver '${driverName}' for activity '${activity}' due to missing data.`);
                continue;
            }

            // Compute first-order index (S_i)
            // S_i = ( (1/N) * sum(Y_AiBj - Y_Bj)^2 ) / V(Y)
            const firstOrderNumerator = costsForDriver[activity].reduce((sum, cost, i) => {
                const diff = cost - costsB[activity][i];
                return sum + diff * diff;
            }, 0) / numRuns;

            const firstOrder = firstOrderNumerator / totalVariance;

            // Compute total-order index (S_Ti)
            // S_Ti = ( (1/(2*N)) * sum(Y_Aj - Y_AiBj)^2 ) / V(Y)
            const totalOrderNumerator = costsForDriver[activity].reduce((sum, cost, i) => {
                const diff = costsA[activity][i] - cost;
                return sum + diff * diff;
            }, 0) / (2 * numRuns);

            const totalOrder = totalOrderNumerator / totalVariance;

            firstOrderIndices[activity][driverName] = firstOrder;
            totalOrderIndices[activity][driverName] = totalOrder;
        }
    }
    console.log("Sobol indices computed:", { firstOrderIndices, totalOrderIndices }, reverseMappingAtoD(firstOrderIndices), Object.entries(getDriversWithValue(firstOrderIndices)));

    // Update the analysis results state.
    setAnalysisResults({
        firstOrder: firstOrderIndices,
        totalOrder: totalOrderIndices
    });
}

//#endregion

const processMatrixOld = async (matrix, projectName) => {
    const allRuns = [];
    for (const run of matrix) {
        // console.log("Processing run:", run.requestId, run);
        if (run.error) continue;
        const runCosts = await extractActivityCosts(run, projectName);
        allRuns.push({
            requestId: run.requestId,
            costs: runCosts
        });
    }
    return aggregateCosts(allRuns);
};

const processMatrix = async (matrix, projectName) => {
    const allRuns = [];
    for (const run of matrix) {
        if (run.error) continue;
        console.log("Processing run:", run.requestId, run);
        const runCosts = await extractActivityCosts(run, projectName);
        allRuns.push({
            requestId: run.requestId,
            costs: runCosts
        });
    }
    return aggregateCosts(allRuns); 
};



function calculateConfidenceInterval(mean, stdev, n) {
    if (n <= 1) {
        return NaN; // Not enough data to calculate confidence interval
    }

    const z = 1.96; // 95% confidence level (normal distribution)
    const marginOfError = z * (stdev / Math.sqrt(n));

    return {
        lower: mean - marginOfError,
        upper: mean + marginOfError
    };
}

function truncatedString(a) {
    const tt = (a.length > 15 ? a.substring(0, 12) + '...' : a);
    // console.log("truncatedData:", a, tt);
    return tt;
}

/**
 * Compute per-activity sensitivities from baseline and perturbed costs
 * @param {Object} baselineCosts - { activity: [values] }
 * @param {Object} perturbedCosts - { activity: [values] }
 * @returns {Object} - { activity: {mean, std, min, max, etc} } sensitivities
 */
function computeActivitySensitivities(baselineCosts, statsPerActivity) {
    const sensitivities = {};
    const EPSILON = 1e-14;

    for (const activity of Object.keys(baselineCosts)) {
        const baseValue = baselineCosts[activity][0];
        const pertValue = statsPerActivity[activity].mean;
        // console.log("Computing sensitivity for activity:", activity, "baseValues:", baseValue, "pertValues:", pertValue);

        // Compute element-wise differences
        let diffValue = pertValue - baseValue;
        if (Math.abs(diffValue) < EPSILON) diffValue = 0;

        // Compute stats for these differences
        sensitivities[activity] = diffValue;
    }

    return sensitivities;
}

/**
 * Reverse mapping from driver->activity->value to activity->driver->value
 * @param {Object} resultsPerDriver - { driver: { costs/stats/sensitivities: { activity: value } } }
 * @param {string} key - which nested object to reverse ("sensitivities", "stats", "costs")
 * @returns {Object} - { activity: { driver: value } }
 */
function reverseMappingXX(resultsPerDriver, key) {
    const reversed = {};

    for (const [driver, driverData] of Object.entries(resultsPerDriver)) {
        const activityValues = driverData[key];
        if (!activityValues) continue;

        for (const [activity, value] of Object.entries(activityValues)) {
            if (!reversed[activity]) reversed[activity] = {};
            reversed[activity][driver] = value;
        }
    }

    return reversed;
}

function reverseMapping(resultsPerDriver, key) {
    const perActivity = {};
    for (const [driver, payload] of Object.entries(resultsPerDriver)) {
        const sens = (payload && payload[key]) || {};
        for (const [activity, value] of Object.entries(sens)) {
            if (!perActivity[activity]) perActivity[activity] = {};
            perActivity[activity][driver] = value;
        }
    }
    return perActivity;
}


function reverseMappingAtoD(resultsPerDriver) {
    let result = {};
    for (const [act, actDrivers] of Object.entries(resultsPerDriver)) {
        // console.log("reverseMappingAtoD", act, actDrivers);

        for (const [driver, value] of Object.entries(actDrivers)) {
            if (!result[driver]) {
                result[driver] = {};
            }
            result[driver][act] = value;
        }
    }
    return result;
}


/**
 *  Filter out drivers with zero value across all activities
 * @param {*} activityData 
 * @returns 
 */
function getDriversWithValue(activityData) {
    const result = {};

    for (const activity in activityData) {
        const drivers = activityData[activity];
        const nonZeroDrivers = {};

        for (const driver in drivers) {
            if (drivers[driver] !== 0) {
                nonZeroDrivers[driver] = drivers[driver];
            }
        }

        result[activity] = nonZeroDrivers;
    }

    return result;
}


const SimpleBarChart = ({ results }) => (
    <BarChart
        xAxis={[
            {
                data: Object.keys(results),
                scaleType: "band",
                tickLabelStyle: {
                    angle: -35, // Rotates labels by -45 degrees
                    textAnchor: 'end', // Aligns the text to the end of the label
                    fontSize: 10, // Optional: Adjust font size for better fit
                },
            },
        ]}
        series={[
            {
                data: Object.values(results),
                name: "1. Order Indices",
                minBarSize: 2, // Ensures a minimum bar height of 2 pixels
            },
        ]}
        margin={{
            bottom: 100, // Adjust this value as needed
        }}
    />
);


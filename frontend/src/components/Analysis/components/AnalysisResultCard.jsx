import { useMemo } from "react";
import { useEffect, useState } from "react";
import React from "react";
import { Flex, Heading, SimpleGrid, Card, CardHeader, CardBody, Text, Select, Stack, Button, Progress, Box, Textarea, UnorderedList, ListItem, Grid, Divider } from '@chakra-ui/react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { getFiles, getFile } from "../../../util/Storage.js";
import { AnalysisResultDiagrams } from "./AnalysisResultDiagrams.jsx";


// XML Parser vorbereiten
const parser = new DOMParser();

const testCosts = [1.2, 2.3, 2.5, 3.1, 2.9, 4.0, 3.5, 2.8, 3.3, 4.1, 5.0, 3.8, 4.5, 2.7, 3.9];
const testStats = stats(testCosts);

// response: array of Monte Carlo run results
export default function AnalysisResultCard({ response, projectName }) {
    const runs = response.runs || [];
    // const runsX = Array.isArray(runs) ? runs : runs ? [runs] : [];
    console.log("[AnalysisResultCard] parra", projectName, response, runs);
    // console.log("AnalysisResultCard runsX:", runsX);

    console.log("[Output Diagramms] Runs ", runs, projectName);
    const [allRuns, setAllRuns] = useState([]);
    const [deterministic, setDeterministic] = useState([]);
    const [nonDeterministic, setNonDeterministic] = useState([]);

    // runs verarbeiten, sobald Komponente gerendert wurde
    React.useEffect(() => {
        async function processRuns() {
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
            setNonDeterministic(nonDet);

            console.log("[Output Diagramms] Deterministic ", deterministic);
            console.log("[Output Diagramms] Non Deterministic ", nonDeterministic);
        }

        processRuns();
    }, [runs]);



    return (
        <Card bg="white">
            <CardHeader>
                <Heading size='md'>Analysis Results ({response.analysisName} {formatDuration(response.durationMs)})</Heading>
            </CardHeader>
            <CardBody>
                <Flex direction="column" gap={6}>
                    {/* Deterministic Activities Section */}
                    <Box flex={1} sx={{ minWidth: 212 }}>
                        <Text fontWeight="bold">Deterministic Activities</Text>

                        {deterministic.length > 0 ? (
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
                        ) : (
                            <Text className="text-gray-400 ml-4">No deterministic activities</Text> // placeholder aligned with bullets
                        )}
                    </Box>

                    <Divider />

                    {/* Distributed  Activity Costs Section */}
                    <Box flex={1}>
                        <Text fontWeight="bold" mb={2}>Non-Deterministic Activities</Text>
                        <AnalysisResultDiagrams activity={"testA"} costs={testCosts} stats={testStats} />

                        {nonDeterministic.length > 0 ? (
                            <SimpleGrid
                                minChildWidth="250px"
                                spacing={4}
                            >
                                {nonDeterministic.map(({ name, stats, costs }) => (
                                    <AnalysisResultDiagrams key={name} activity={name} costs={costs} stats={stats} />
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Text color="gray.400">No non-deterministic activities</Text>
                        )}
                    </Box>



                </Flex>
            </CardBody>

        </Card>

        // <ResponsiveContainer width="100%" height={400}>
        //     <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        //         <CartesianGrid strokeDasharray="3 3" />
        //         <XAxis dataKey="activity" />
        //         <YAxis />
        //         <Tooltip />
        //         <Legend />
        //         {runs.map((_, idx) => (
        //             <Bar key={`run${idx+1}`} dataKey={`run${idx+1}`} fill={`hsl(${(idx*60)%360},70%,50%)`} />
        //         ))}
        //     </BarChart>
        // </ResponsiveContainer>
    );
}


async function extractActivityCosts(run, projectName) {
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

function aggregateCosts(data) {
    const result = {};

    data.forEach(run => {
        const costs = run.costs;
        // console.log("[aggregateCosts] Run costs:", costs);
        for (const activity in costs) {
            if (!result[activity]) {
                result[activity] = [];
            }
            result[activity].push(costs[activity][1]);
        }
    });

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

    return { count: n, mean, variance, stdev, min, max, deterministic };
}

function formatDuration(durationMs, includeFractional = false) {
    const totalSeconds = durationMs / 1000;
    console.log("formatDuration", durationMs, totalSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = includeFractional
        ? (totalSeconds % 60).toFixed(2)
        : Math.floor(totalSeconds % 60);

    if (minutes === 0) return `${seconds} sec`;
    else return `${minutes} min ${seconds} sec`;
}
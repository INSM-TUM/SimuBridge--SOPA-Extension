import { Box, Text } from "@chakra-ui/react";
// import { BarChart } from '@mui/x-charts';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import { createTheme, ThemeProvider } from "@mui/material";

import { mangoFusionPalette } from '@mui/x-charts';
import { act } from "react";



// const data = [4, 3, 5];
// const labels = ["A", "B", "C"];



export function AnalysisResultDiagrams({ activity, costs, stats, desiredBins = 30 }) {
    // console.log("[AnalysisResultDiagrams] activity costs", costs);

    const binSize = getDynamicBinSize(costs, desiredBins);
    const binnedData = binData(costs, binSize, stats.min ?? 0);
    const labels = generateBinLabels(binnedData.length, binSize, stats.min ?? 0);
    // console.log("[AnalysisResultDiagrams] binnedData", binnedData, costs, stats, labels);

    const theme = createTheme();

    // create a "variance" series: min -> max as a bar
    const varianceSeries = binnedData.map((_, i) => ({
        min: stats.min,
        max: stats.max,
        mean: stats.mean,
    }));


    if (activity === "testA") {
        console.log("AnalysisResultDiagrams render testA", activity, costs, stats, binSize, binnedData, labels);
    }


    //#region html return
    return (
        <ThemeProvider theme={theme}>
            {/* <Box w="400px" p={1} borderWidth={1} borderRadius="md"> */}
            <Box minWidth="400px" p={1} borderWidth={1} borderRadius="md">
                {/* Activity Name */}
                <Text fontWeight="semibold" color="gray.600" textAlign="center" >
                    {activity.replace(/_/g, " ")}
                </Text>

                {/* Histogram */}
                <Box w="100%" h="150px">
                    <BarChart
                        xAxis={[{ data: labels, scaleType: "band" }]}
                        series={[{ data: binnedData }]}
                        height={150}
                        margin={{
                            top: 20,
                            bottom: 30,
                            left: 50,
                            right: 20
                        }}
                    />
                </Box>

                {/* Variance/Boxplot approximation */}
                {/* <Box w="100%" h="50px" mt={2}>
                    <BarChart
                        xAxis={[{ data: labels, scaleType: "band" }]}
                        series={[
                            {
                                type: "bar",
                                data: varianceSeries.map(v => v.max - v.min),
                                name: "Range (min → max)",
                            },
                            {
                                type: "scatter",
                                data: varianceSeries.map(v => v.mean),
                                name: "Mean",
                            },
                        ]}
                        height={50}
                    />
                </Box> */}

                {/* Stats */}
                <Box mt={1} textAlign="center">
                    <Text fontSize="sm">
                        Mean: {stats.mean.toExponential(2)}, Min: {stats.min.toExponential(2)}, Max: {stats.max.toExponential(2)} <br />
                        Standard Deviation: {stats.stdev.toExponential(2)}, Variance: {stats.variance.toExponential(2)}
                    </Text>
                </Box>
            </Box>
        </ThemeProvider>

    );
    //#endregion
}


//#region Histogram Helpers

function getDynamicBinSize(costs, desiredBins) {
    if (costs.length === 0) return 1; // fallback
    const min = Math.min(...costs);
    const max = Math.max(...costs);
    const range = max - min;
    const raw = range / desiredBins;

    //round to nearest nic number (0.01, 0.05, 0.1, 0.5, 1)
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    const nice = Math.ceil(raw / magnitude) * magnitude;
    return nice;
}

function binData(data, binSize, minValue) {
    const bins = [];
    let maxBin = 0;

    for (let i = 0; i < data.length; i++) {
        // const binIndex = Math.floor(data[i] / binSize);
        const binIndex = Math.floor((data[i] - minValue) / binSize);
        bins[binIndex] = (bins[binIndex] || 0) + 1;
        if (binIndex > maxBin) maxBin = binIndex;
    }

    // fill empty bins with 0
    for (let i = 0; i <= maxBin; i++) {
        if (!bins[i]) bins[i] = 0;
    }

    return bins;
}

function generateBinLabels(binCount, binSize, minValue) {
    const labels = [];
    const decimals = getDecimals(binSize);
    for (let i = 0; i < binCount; i++) {
        const start = (minValue + i * binSize).toExponential(2)//.toFixed(decimals);
        const end = (minValue + (i + 1) * binSize).toExponential(2)//.toFixed(decimals);
        if (decimals <= 2)
            labels.push(`${start}–${end}`);
        else
            labels.push(`${start}`);
        // labels.push(`${start}–${end}`);
    }
    return labels;
}

function getDecimals(num) {
    const log10 = Math.ceil(-Math.log10(num));
    return log10 > 0 ? log10 : 0;
}

//#endregion
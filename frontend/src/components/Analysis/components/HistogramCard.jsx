import { Box, Text } from "@chakra-ui/react";
// import { BarChart } from '@mui/x-charts';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import { createTheme, ThemeProvider } from "@mui/material";

import { mangoFusionPalette } from '@mui/x-charts';



// const data = [4, 3, 5];
// const labels = ["A", "B", "C"];

export function HistogramCard({ activity, costs, stats }) {
    // console.log("[HistogramCard] costs", costs);
    const binSize = 0.5;
    const binnedData = binData(costs, binSize);
    const labels = generateBinLabels(binnedData.length, binSize);
    // console.log("[HistogramCard] binnedData", binnedData, costs, stats, labels);

    const theme = createTheme();



    return (
        <ThemeProvider theme={theme}>
            <Box w="400px" p={1} borderWidth={1} borderRadius="md">
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
                    />
                </Box>

                {/* Stats */}
                <Box mt={1} textAlign="center">
                    <Text fontSize="sm">
                        Mean: {stats.mean.toFixed(2)}, Min: {stats.min.toFixed(2)}, Max: {stats.max.toFixed(2)}, StdDev: {stats.stdev.toFixed(2)}, Variance: {stats.variance.toFixed(2)}
                    </Text>
                </Box>
            </Box>
        </ThemeProvider>

    );
}

function binData(data, binSize) {
    const bins = [];
    let maxBin = 0;

    for (let i = 0; i < data.length; i++) {
        const binIndex = Math.floor(data[i] / binSize);
        bins[binIndex] = (bins[binIndex] || 0) + 1;
        if (binIndex > maxBin) maxBin = binIndex;
    }

    // Fill empty bins with 0
    for (let i = 0; i <= maxBin; i++) {
        if (!bins[i]) bins[i] = 0;
    }

    return bins;
}

function generateBinLabels(binCount, binSize) {
    const labels = [];
    for (let i = 0; i < binCount; i++) {
        const start = (i * binSize).toFixed(2);
        const end = ((i + 1) * binSize).toFixed(2);
        labels.push(`${start}–${end}`);
    }
    return labels;
}

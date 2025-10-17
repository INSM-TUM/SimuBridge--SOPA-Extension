import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formattedToString} from "./../analysisUtils.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export const ConfidenceChart = ({ activityData, isDarkMode }) => {
    const [chartData, setChartData] = useState({});

    const truncatedData = (arr) => arr.map(item => {
        if (item.length > 15) {
            return item.substring(0, 12) + '...';
        }
        return item;
    });

    useEffect(() => {
        const chartColors = {
            light: {
                barMean: 'rgba(75, 192, 192, 0.6)',
                border: 'rgba(75, 192, 192, 1)',
                text: 'rgba(0, 0, 0, 0.8)',
            },
            dark: {
                barMean: 'rgba(75, 192, 192, 0.6)',
                border: 'rgba(75, 192, 192, 1)',
                text: 'rgba(255, 255, 255, 0.8)',
            },
        };
        const colors = isDarkMode ? chartColors.dark : chartColors.light;



        // Data for the chart
        const dataForChart = {
            labels: activityData.map(a => a.name.replaceAll(/_/g, " ")),
            datasets: [
                {
                    label: 'Mean',
                    data: activityData.map(a => a.stats.mean),
                    backgroundColor: colors.barMean,
                    borderColor: colors.border,
                    borderWidth: 1,
                },
            ],
        };
        setChartData(dataForChart);

    }, [activityData, isDarkMode]);

    // error bars
    const errorBarsPlugin = {
        id: 'errorBarsPlugin',
        afterDraw: (chart) => {
            const { ctx, scales: { x, y } } = chart;
            ctx.save();

            const barThickness = chart.getDatasetMeta(0).data[0].width;
            const capWidth = barThickness * 0.5;

            chart.getDatasetMeta(0).data.forEach((bar, index) => {
                const item = activityData[index];
                const mean = item.stats.mean;
                const confInterval = item.stats.confInterval;

                // pixel positions for error bar
                const topY = y.getPixelForValue(confInterval.upper)
                const bottomY = y.getPixelForValue(confInterval.lower);
                const barX = bar.x;

                // line style:
                ctx.strokeStyle = isDarkMode ? 'white' : 'black';
                ctx.lineWidth = 1.5;

                //main vertical line
                ctx.beginPath();
                ctx.moveTo(barX, topY);
                ctx.lineTo(barX, bottomY);
                ctx.stroke();

                // top cap
                ctx.beginPath();
                ctx.moveTo(barX - capWidth / 2, topY);
                ctx.lineTo(barX + capWidth / 2, topY);
                ctx.stroke();

                // bottom cap
                ctx.beginPath();
                ctx.moveTo(barX - capWidth / 2, bottomY);
                ctx.lineTo(barX + capWidth / 2, bottomY);
                ctx.stroke();
            });

            ctx.restore();
        }
    };

    //max y-axis value
    const maxUpperConf = activityData.reduce((max, item) => {
        return Math.max(max, item.stats.confInterval.upper);
    }, 0);

    // max value buffer 5%
    const yMax = maxUpperConf * 1.05;


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    afterBody: (context) => {
                        const index = context[0].dataIndex;
                        const item = activityData[index];
                        const confInterval = item.stats.confInterval;
                        return `95% Confidence Interval: ${confInterval.lower.toExponential(2)} - ${confInterval.upper.toExponential(2)}`;
                    },
                    label: function (context) {
                        const xxx=  formattedToString(context.parsed.y); 
                        // console.log("formatted in confidence", xxx, context.parsed.y);
                        return xxx;
                    }
                },

            },
            title: {
                display: false,
                text: 'Mean with Confidence Interval per Activity',
                font: {
                    size: 16,
                    weight: 'bold',
                },
                color: isDarkMode ? 'white' : 'black',
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 10,
                    },
                    color: isDarkMode ? 'white' : 'black',
                    maxRotation: 35, 
                    minRotation: 35,
                    callback: function (value, index) {
                        const fullLabel = this.getLabelForValue(value);
                        return truncatedData([fullLabel])[0];
                    },
                },
                grid: {
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
            },
            y: {
                min: 0,
                max: yMax,
                ticks: {
                    color: isDarkMode ? 'white' : 'black',
                    callback: (value) => formattedToString(value),
                },
                grid: {
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
            },
        },
    };

    return (
        <div className="w-full" style={{ height: '250px', paddingTop: '30px', marginTop: '-30px' }} >
            {Object.keys(chartData).length > 0 && (
                <Bar options={chartOptions} data={chartData} plugins={[errorBarsPlugin]} />
            )}
        </div>
    );
};
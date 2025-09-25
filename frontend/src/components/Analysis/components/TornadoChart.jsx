import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useMemo } from 'react';

// Register the necessary components from Chart.js
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

export default function TornadoChart({ sensitivityValues, name, darkMode }) {
    // console.log("Rendering TornadoChart with sensitivityValues:", sensitivityValues, "and name:", name);
  const chartData = useMemo(() => {
    if (!sensitivityValues || sensitivityValues === undefined || Object.keys(sensitivityValues).length === 0) {return {labels: [],datasets: []};}
    const labels = Object.keys(sensitivityValues);
    const data = Object.values(sensitivityValues).map(v => parseFloat(v));

    return {
      labels: labels,
      datasets: [
        {
          label: 'Signed Values',
          data: data.map(v => v.toFixed(2)),
          backgroundColor: (context) => {
            const value = context.raw;
            return value > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(94, 218, 69, 0.6)';
          },
          borderColor: (context) => {
            const value = context.raw;
            return value > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(70, 141, 48, 1)';
          },
          borderWidth: 1,
        },
      ],
    };
  }, [sensitivityValues]);

  const allValues = Object.values(sensitivityValues);
  const dataMax = Math.max(...allValues, 0); // Include 0 to handle all-negative data
  const dataMin = Math.min(...allValues, 0); // Include 0 to handle all-positive data
  // console.log("TornadoChart dataMin, dataMax:", dataMin, dataMax);
  
  // Define a small padding value to ensure the first tick is visible
  const padding = 0.1;
//   const scaleMax = Math.max(dataMax, dataMin*-0.1);
//   const scaleMin = Math.min(dataMin, dataMax*-0.1);

  const scaleMax = dataMax
  const scaleMin = dataMin

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Sensitivity Chart: ' + name,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += Math.abs(context.parsed.x);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        // Set min and max values for the x-axis scale
        min: scaleMin,
        max: scaleMax,
        title: {
          display: true,
          text: 'Cost Value'
        },
      },
      y: {
        grid: {
          display: false,
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
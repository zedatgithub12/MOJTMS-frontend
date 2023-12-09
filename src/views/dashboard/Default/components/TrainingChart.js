import { useTheme } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const TrainingChart = () => {
    const theme = useTheme();
    const data = {
        series: [
            { name: 'Males', data: [80, 90, 80, 90, 80, 90, 80, 60, 60, 90, 60, 100] }, //70, 80, 90, 80, 90,
            { name: 'Females', data: [75, 50, 60, 75, 50, 60, 75, 80, 90, 70, 70, 80] } //50, 60, 75, 50, 60,
        ],
        options: {
            chart: {
                type: 'line'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yaxis: {},
            legend: {
                position: 'top'
            },
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            stroke: {
                curve: 'smooth'
            }
        }
    };

    return <Chart options={data.options} series={data.series} type="line" width="100%" height={400} />;
};

export default TrainingChart;

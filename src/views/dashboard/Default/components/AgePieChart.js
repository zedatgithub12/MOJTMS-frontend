import { useTheme } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const AgePieChart = ({ olderThan30, youngerThan30 }) => {
    const theme = useTheme();
    const data = {
        series: [olderThan30, youngerThan30],
        options: {
            chart: {
                type: 'pie'
            },
            labels: ['Older than 30', 'Younger than 30'],
            colors: ['#7085ff', '#005eff'], // Customize the colors here
            legend: {
                position: 'bottom'
            }
        }
    };

    return <Chart options={data.options} series={data.series} type="pie" height={260} />;
};

export default AgePieChart;

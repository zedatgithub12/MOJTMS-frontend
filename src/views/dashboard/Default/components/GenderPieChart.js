import { useTheme } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const GenderPieChart = ({ males, females }) => {
    const theme = useTheme();
    const data = {
        series: [males, females],
        options: {
            chart: {
                type: 'pie'
            },
            labels: ['Males', 'Females'],
            colors: [theme.palette.primary.main, theme.palette.secondary[800]], // Customize the colors here
            legend: {
                position: 'bottom'
            }
        }
    };

    return <Chart options={data.options} series={data.series} type="pie" height={260} />;
};

export default GenderPieChart;

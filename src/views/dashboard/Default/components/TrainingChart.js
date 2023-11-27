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
                type: 'bar',
                height: 400
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] //'Jan', 'Feb', 'Mar', 'Apr', 'May',
            },
            yaxis: {
                // title: {
                //     text: 'Number of Trainees'
                // }
            },
            legend: {
                position: 'top'
            },
            colors: [theme.palette.primary.main, theme.palette.secondary[800]]
        }
    };

    return <Chart options={data.options} series={data.series} type="bar" height={400} />;
};

export default TrainingChart;

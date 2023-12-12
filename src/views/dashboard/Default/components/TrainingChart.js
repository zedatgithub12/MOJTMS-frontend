import { Grid } from '@mui/material';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

const TrainingChart = ({ data, width }) => {
    const series = [
        {
            name: 'Male',
            data: data.map((item) => parseInt(item.maleCount))
        },
        {
            name: 'Female',
            data: data.map((item) => parseInt(item.femaleCount))
        }
    ];

    const options = {
        chart: {
            type: 'line'
        },
        xaxis: {
            categories: data.map((item) => item.monthName)
        },
        yaxis: {},
        legend: {
            position: 'bottom'
        },
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800']
        // stroke: {
        //     curve: 'smooth'
        // }
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Chart options={options} series={series} type="line" width={width} height={400} />
            </Grid>
        </Grid>
    );
};

TrainingChart.propTypes = {
    data: PropTypes.array,
    width: PropTypes.string
};

export default TrainingChart;

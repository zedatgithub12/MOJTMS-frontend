import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { NoResult } from 'utils/components/noresult';
import TraineeTable from './TraineeTable';

const DepartmentTrainees = ({ data }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                {data.length === 0 ? <NoResult title="" message="No trainees found" /> : <TraineeTable rows={data} />}
            </Grid>
        </Grid>
    );
};

DepartmentTrainees.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.array
};

export default DepartmentTrainees;

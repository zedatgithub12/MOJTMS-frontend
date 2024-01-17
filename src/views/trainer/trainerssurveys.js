import { useState } from 'react';
import { CircularProgress, Grid, TablePagination } from '@mui/material';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { NoResult } from 'utils/components/noresult';
import errorImage from 'assets/images/error.jpg';
import Connections from 'api';
import PropTypes from 'prop-types';
import TrainerSurveyListing from './components/TrainerSurvey';

const TrainersSurveys = ({ trainer_id }) => {
    const [loading, setLoading] = useState(false);
    const [assignedSurveys, setAssignedSurveys] = useState([]);

    const [counts, setCounts] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    });

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchAssignedSurvey();
        } else {
            FetchAssignedSurvey();
        }
    };

    const FetchAssignedSurvey = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainersurveys + '/trainer/' + trainer_id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            setLoading(false);
            const data = parsed.data;
            setAssignedSurveys(data.data);
            setCounts(data.total);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    //handle the page change of the trainee listing table
    const handleChangePage = (event, newPage) => {
        setPaginationModel({
            ...paginationModel,
            page: newPage
        });
    };

    //handle the page size or row count number of the listing table
    const handleChangeRowsPerPage = (event) => {
        setPaginationModel({
            ...paginationModel,
            pageSize: parseInt(event.target.value, 10),
            page: 0
        });
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                {loading ? (
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size={20} />
                        </Grid>
                    </Grid>
                ) : error ? (
                    <ErrorPrompt
                        image={errorImage}
                        title="Server Error"
                        message="Oooops... There is server error fetching filled surveys"
                    />
                ) : assignedSurveys.length === 0 ? (
                    <NoResult title="" message="Oooops... No filled survey found" />
                ) : (
                    <div>
                        <TrainerSurveyListing rows={assignedSurveys} />
                        <TablePagination
                            component="div"
                            count={counts}
                            page={paginationModel.page}
                            onPageChange={handleChangePage}
                            rowsPerPage={paginationModel.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

TrainersSurveys.propTypes = {
    trainer_id: PropTypes.number
};

export default TrainersSurveys;

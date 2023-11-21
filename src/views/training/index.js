import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, Pagination } from '@mui/material';
// project imports
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import Connections from 'api';
import noresult from 'assets/images/no_result.png';
import errorImage from 'assets/images/error.jpg';
import TrainingCard from 'ui-component/cards/TrainingCard';
import TrainingCardSkel from 'ui-component/cards/Skeleton/TrainingCardSkel';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';

// ==============================|| TRAINING PAGE ||============================== //

const Training = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const ImageApi = Connections.thumbnails;

    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchTraining();
        } else {
            FetchTraining();
        }
    };

    const FetchTraining = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainings + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            setLastPage(parsed.data.last_page);
            const data = parsed.data.data;
            setTrainings(data);
            setLoading(false);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api +
            Connections.trainingsearch +
            `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;

        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, { method: 'GET', headers: headers })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setSearching(false);
                    setTrainings(response.data.data);
                } else {
                    setSearching(false);
                }
            })
            .catch((error) => {
                setSearching(false);
                handlePrompts(error, 'error');
            });
    };

    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    return (
        <Grid
            container
            sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: theme.palette.primary[200] + 25,
                ':hover': {
                    boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <MediumHeader
                title="Trainings"
                back={true}
                option={false}
                sx={{ background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.main})` }}
            />

            <Grid container sx={{ minHeight: 200, padding: 1 }}>
                <SearchFilterAdd
                    searchText={search}
                    searching={searching}
                    onTextChange={(event) => setSearch(event.target.value)}
                    onSubmit={() => handleSearching()}
                    addTitle="Add Training"
                    onAdd={() => navigate('/training/add')}
                />

                <Grid container>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} spacing={1}>
                        {loading ? (
                            <Grid container>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                                        <TrainingCardSkel key={index} />
                                    ))}
                                </Grid>
                            </Grid>
                        ) : error ? (
                            <ErrorPrompt
                                image={errorImage}
                                title="Server Error"
                                message="Oooops... There is server error fetching trainings!"
                                buttontitle="Go Back"
                                onPress={() => navigate(-1)}
                            />
                        ) : trainings.length == 0 ? (
                            <NoResult
                                image={noresult}
                                title="Result Not Found"
                                message="Oooops... no training found in the moment!"
                                buttontitle="Go Back"
                                onPress={() => navigate(-1)}
                            />
                        ) : (
                            trainings.map((training) => (
                                <TrainingCard
                                    key={training.id}
                                    isLoading={isLoading}
                                    image={ImageApi + training.thumbnail}
                                    title={training.title}
                                    language={training.language}
                                    category={training.category}
                                    departments={training.department}
                                    sessions={training.sessions}
                                    traineecount={training.trainees}
                                    rating={training.rating}
                                    ratingcount={training.ratingcount}
                                    onPress={() => navigate('/training/view', { state: training })}
                                />
                            ))
                        )}
                    </Grid>

                    {trainings.length != 0 && (
                        <Box sx={{ paddingY: 4 }}>
                            <Pagination
                                showFirstButton
                                showLastButton
                                count={rowCountState}
                                page={paginationModel.page}
                                onChange={handleChange}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Training;

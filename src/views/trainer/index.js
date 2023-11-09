import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, Pagination } from '@mui/material';
// project imports
import Connections from 'api';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import TrainerCard from 'ui-component/cards/TrainerCard';

// ==============================|| TRAINERS PAGE ||============================== //

const Trainers = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const ImageApi = Connections.profiles;

    const [trainers, setTrainers] = useState([]);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleCategoryFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchTrainers();
        } else {
            FetchTrainers();
        }
    };

    const FetchTrainers = async () => {
        var Api = Connections.api + Connections.trainers + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            setTrainers(data);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel], () => handleCategoryFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api +
            Connections.traineestatus +
            `/search?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;

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
                    setTrainers(response.data.data);
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
            <MiniHeader title="Trainers" ፍ back={true} sx={{ backgroundColor: theme.palette.secondary.dark }} />

            <Grid container sx={{ minHeight: 200, padding: 1 }}>
                <SearchFilterAdd
                    searchText={search}
                    searching={searching}
                    onTextChange={(event) => setSearch(event.target.value)}
                    onSubmit={() => handleSearching()}
                    addTitle="Add Trainer"
                    onAdd={() => navigate('/trainer/add')}
                />

                <Grid container>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} spacing={1}>
                        {trainers.map((trainer) => (
                            <TrainerCard
                                key={trainer.id}
                                isLoading={isLoading}
                                image={ImageApi + trainer.photo}
                                title={trainer.specialisation}
                                email={trainer.email}
                                phone={trainer.phone}
                                qualification={trainer.qualifications}
                                name={trainer.name}
                                linkedin={trainer.linkedin_profile}
                                address={trainer.address}
                                gender={trainer.gender}
                                trainingcount={trainer.training}
                                rating={trainer.rating}
                                onPress={() => navigate('/trainer/view', { state: trainer })}
                            />
                        ))}
                    </Grid>
                    <Box sx={{ paddingY: 4 }}>
                        <Pagination
                            showFirstButton
                            showLastButton
                            count={rowCountState}
                            page={paginationModel.page}
                            onChange={handleChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Trainers;

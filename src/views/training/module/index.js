import React, { useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import { SearchAdd } from './searchadd';
import { useQuery } from 'react-query';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import ModuleList from './modulelist';
import CreateModule from './createmodule';
import Connections from 'api';
import PropTypes from 'prop-types';

const TrainingModules = ({ training_id }) => {
    const { t } = useTranslation();
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [create, setCreate] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 1
    });

    //a function that checks if the token is expired
    //if the token is expired refresh token
    //else fetch a modules
    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchModules();
        } else {
            FetchModules();
        }
    };

    const FetchModules = async () => {
        setLoading(true);
        var Api =
            Connections.api + Connections.trainingModules + training_id + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            setModules(data);
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api +
            Connections.modulesearch +
            training_id +
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
                    setModules(response.data.data);
                } else {
                    setSearching(false);
                }
            })
            .catch((error) => {
                setSearching(false);
                handlePrompts(error, 'error');
            });
    };

    const handlePageChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };
    return (
        <Grid container>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
                {role === 'Admin' ? (
                    <React.Fragment>
                        <SearchAdd
                            searchText={search}
                            searching={searching}
                            onTextChange={(event) => setSearch(event.target.value)}
                            onSubmit={() => handleSearching()}
                            onAdd={() => setCreate(!create)}
                        />
                        {create && training_id && (
                            <CreateModule
                                training_id={training_id}
                                handleClosePanel={() => setCreate(false)}
                                sx={{ opacity: create ? 1 : 0, transition: 'all 0.5s ease-in forward' }}
                            />
                        )}
                    </React.Fragment>
                ) : role === 'Coordinator' ? (
                    <React.Fragment>
                        <SearchAdd
                            searchText={search}
                            searching={searching}
                            onTextChange={(event) => setSearch(event.target.value)}
                            onSubmit={() => handleSearching()}
                            onAdd={() => setCreate(!create)}
                        />
                        {create && training_id && (
                            <CreateModule
                                training_id={training_id}
                                handleClosePanel={() => setCreate(false)}
                                sx={{ opacity: create ? 1 : 0, transition: 'all 0.5s ease-in forward' }}
                            />
                        )}
                    </React.Fragment>
                ) : null}

                <ModuleList modules={modules} loading={loading} error={error} sx={{ marginTop: 1.5 }} />

                {/* the pagination will be shown when the number of modules exceed five */}
                {lastPage > 1 && (
                    <Box sx={{ paddingY: 4 }}>
                        <Pagination
                            showFirstButton
                            showLastButton
                            count={parseInt(lastPage * paginationModel.pageSize)}
                            page={paginationModel.page}
                            onChange={() => handlePageChange()}
                        />
                    </Box>
                )}
            </Grid>
            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

TrainingModules.propTypes = {
    training_id: PropTypes.number
};
export default TrainingModules;

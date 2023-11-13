import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { SearchAdd } from './components/searchadd';
import Connections from 'api';
import CreateModule from './components/addmodule';

const TrainingModules = ({ training_id }) => {
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);

    const [create, setCreate] = useState(false);

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api + Connections.modulesearch + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;

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

    return (
        <Grid container>
            <Grid item xs={12}>
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
            </Grid>
        </Grid>
    );
};

TrainingModules.propTypes = {
    training_id: PropTypes.number
};
export default TrainingModules;

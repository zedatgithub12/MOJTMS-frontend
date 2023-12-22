import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, Pagination, CircularProgress } from '@mui/material';
// project imports
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { TimeFormatter } from 'utils/functions';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { NoResult } from 'utils/components/noresult';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import AssessmentCard from './components/assessmentCard';
import SplitButton from 'ui-component/Buttons/SplitButton';
import noresult from 'assets/images/no_result.png';

// ==============================|| ASSESSEMENT PAGE ||============================== //

const AssessmentStatus = ['draft', 'active', 'archived'];

const Assessment = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('active');
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCount, setRowCount] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            fetchAssessments();
        } else {
            fetchAssessments();
        }
    };

    const fetchAssessments = async () => {
        setLoading(true);
        var Api =
            Connections.api + Connections.assessments + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&status=${status}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data.data;
            const totalrows = parsed.data.total;
            const lastPage = parsed.data.last_page;

            setData(data);
            setRowCount(totalrows);
            setLastPage(lastPage);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel, status], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api +
            Connections.assessmentSearch +
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
                    setData(response.data.data);
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

    //handle status change
    const handleStatusChange = (index) => {
        const selectedStatus = AssessmentStatus[index];
        setSelectedIndex(index);
        setStatus(selectedStatus);
    };

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            <Grid
                item
                xs={11}
                sm={10}
                md={10}
                lg={8}
                xl={8}
                sx={{
                    marginBottom: 2,
                    minHeight: '45vh',
                    borderRadius: 4,
                    border: '1px solid',
                    background: theme.palette.primary.light,
                    borderColor: theme.palette.primary[200]
                }}
            >
                <MediumHeader
                    title="Assessments"
                    back={true}
                    option={false}
                    sx={{ background: `linear-gradient(to left, ${theme.palette.secondary.light}, ${theme.palette.primary[200]})` }}
                />
                <SearchFilterAdd
                    searchText={search}
                    searching={searching}
                    onTextChange={(event) => setSearch(event.target.value)}
                    onSubmit={() => handleSearching()}
                    addTitle="Create Assessment"
                    onAdd={() => navigate('/assessment/create')}
                />

                <Box sx={{ padding: 2 }}>
                    <SplitButton
                        options={AssessmentStatus}
                        onPress={(event, index) => handleStatusChange(index)}
                        selectedIndex={selectedIndex}
                    />

                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                            <CircularProgress size={22} />
                        </Box>
                    ) : error ? (
                        <ErrorPrompt image={noresult} title="Server Error" message="Oooops... unable to fetch the assessments!" />
                    ) : data.length === 0 ? (
                        <NoResult title="" message="No assessment found" />
                    ) : (
                        <div>
                            {data.map((item) => (
                                <AssessmentCard
                                    key={item.id}
                                    name={item.assessment_name}
                                    description={item.assessment_description}
                                    score={item.passing_score}
                                    duration={TimeFormatter(item.duration)}
                                    instruction={item.instructions}
                                    option={true}
                                    onClick={() => navigate('/assessment/view', { state: item })}
                                    status={item.status}
                                    sx={{}}
                                />
                            ))}
                            {rowCount > paginationModel.pageSize && (
                                <Box sx={{ paddingY: 4 }}>
                                    <Pagination
                                        showFirstButton
                                        showLastButton
                                        count={lastPage}
                                        page={paginationModel.page}
                                        onChange={handleChange}
                                    />
                                </Box>
                            )}
                        </div>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default Assessment;

import { Button, ButtonGroup, CircularProgress, Grid, Pagination, Typography, useTheme } from '@mui/material';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { Box } from '@mui/system';
import { Fragment, useState } from 'react';
import { useLocation } from 'react-router';
import { NoResult } from 'utils/components/noresult';
import { useQuery } from 'react-query';
import { UpdateMaterial } from './updatematerial';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { useTranslation } from 'react-i18next';
import MaterialCard from 'ui-component/cards/materialCard';
import noresult from 'assets/images/no_result.png';
import TopContents from './components/TopContents';
import Connections from 'api';

const ModuleStatus = ['active', 'archived'];

const Materials = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { state } = useLocation();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const user = ActiveUser.user;
    const [status, setStatus] = useState('active');

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [training, setTraining] = useState([]);
    const [totalMaterial, setTotalMaterial] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 12,
        page: 1
    });

    const [updateMaterial, setUpdateMaterial] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchMaterials();
        } else {
            FetchMaterials();
        }
    };

    const FetchMaterials = async () => {
        setLoading(true);
        var Api =
            Connections.api +
            Connections.allmaterials +
            state.id +
            `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&status=${status}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const pages = parsed.data.last_page;
            const data = parsed.data.data;
            const training = parsed.training;
            const total = parsed.data.total;

            setData(data);
            setTraining(training);
            setTotalMaterial(total);
            setLastPage(pages);
            setLoading(false);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel, status], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    //handle adding material to the module
    const handleUpdateMaterial = (material) => {
        setUpdateMaterial(true);
        setSelectedMaterial(material);
    };

    // Handle material status change  here
    const handleMateriaStatus = (material) => {
        const Api = Connections.api + Connections.materialstatus + material.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const status = material.status === 'active' ? 'archived' : 'active';

        const formData = new FormData();
        formData.append('status', status);

        fetch(Api, { method: 'POST', headers: headers, body: formData })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    const newData = data.filter((item) => item.id !== material.id);
                    setData(newData);

                    handlePrompts(response.message, 'success');
                } else {
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
            });
    };

    // handle material download
    const handleFileDownload = (material) => {
        const folderName = material.file_type;
        const fileName = material.file;

        const Api = Connections.api + Connections.materialdownload + `?folderName=${folderName}&fileName=${fileName}`;

        fetch(Api, { method: 'GET', responseType: 'blob' })
            .then((response) => {
                if (response.status === 200) {
                    // Create a temporary URL for the blob
                    // const url = window.URL.createObjectURL(new Blob([response.data]));
                    const url = response.url;
                    // Create a temporary link element to trigger the download
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();

                    // Clean up the temporary objects after download
                    link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } else {
                    // Handle error response
                    throw new Error('File download failed');
                }
            })
            .catch((error) => {
                // Handle fetch or download error
                console.error(error);
            });
    };

    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };
    return (
        <Fragment>
            <Grid
                container
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backdropFilter: 'blur(20px)',
                    background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`
                }}
            >
                <Grid
                    item
                    xs={11}
                    sm={10}
                    md={10}
                    lg={8}
                    xl={6}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        marginY: 2,
                        borderRadius: 2
                    }}
                >
                    <MiniHeader
                        back={true}
                        title="Training Materials"
                        option={false}
                        sx={{ background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})` }}
                    />

                    <TopContents training={training && training.title} module={state.module_title} description={state.module_description} />

                    {user.role === 'Admin' && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingY: 2,
                                paddingX: 4
                            }}
                        >
                            <ButtonGroup disableElevation variant="text" aria-label="Disabled elevation buttons">
                                {ModuleStatus.map((item, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => setStatus(item)}
                                        variant={status === item ? 'contained' : 'outlined'}
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </ButtonGroup>
                            {totalMaterial > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" paddingRight={2}>
                                        {t('Total')}
                                    </Typography>
                                    <Typography variant="subtitle1"> {totalMaterial}</Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    <Box sx={{ paddingX: 3 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                                <CircularProgress size={22} />
                            </Box>
                        ) : error ? (
                            <ErrorPrompt image={noresult} title="Server Error" message="Oooops... unable to retrive the materials!" />
                        ) : !loading && data.length == 0 ? (
                            <NoResult image={noresult} title="Result Not Found" message="Oooops... No material found!" />
                        ) : (
                            data.map((item) => (
                                <MaterialCard
                                    key={item.id}
                                    material={item}
                                    onUpdate={() => handleUpdateMaterial(item)}
                                    onArchive={() => handleMateriaStatus(item)}
                                    onUnarchive={() => handleMateriaStatus(item)}
                                    onDownload={() => handleFileDownload(item)}
                                />
                            ))
                        )}
                        {data.length != 0 && (
                            <Box sx={{ paddingY: 4 }}>
                                <Pagination
                                    showFirstButton
                                    showLastButton
                                    count={lastPage}
                                    page={paginationModel.page}
                                    onChange={handleChange}
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </Box>
                        )}
                    </Box>

                    {selectedMaterial && (
                        <UpdateMaterial
                            open={updateMaterial}
                            handleClose={() => setUpdateMaterial(false)}
                            sx={{}}
                            materialInfo={selectedMaterial}
                        />
                    )}
                </Grid>
            </Grid>
            <SnackbarProvider maxSnack={3} />
        </Fragment>
    );
};

export default Materials;

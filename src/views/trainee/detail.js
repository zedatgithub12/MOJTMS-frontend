import { useState, useRef } from 'react';
import {
    Grid,
    Box,
    IconButton,
    Typography,
    Avatar,
    useTheme,
    MenuItem,
    ListItemIcon,
    Divider,
    FormControl,
    TextField,
    FormHelperText,
    CircularProgress,
    Badge
} from '@mui/material';

import { IconArrowLeft, IconCamera, IconCheck, IconEdit, IconTrash } from '@tabler/icons';
import { useLocation, useNavigate } from 'react-router';
import DetailTabs from './components/DetailTabs';
import DetailContent from './components/DetailContent';
import Connections from 'api';
import { useQuery } from 'react-query';
import { ActionMenu } from 'ui-component/menu/action';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';
import { sizes } from 'constants';
import { ProfileValidator } from 'utils/functions';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')
});

const TraineeDetails = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();
    const fileInputRef = useRef(null);

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const ImageApi = Connections.profiles;

    const [traineeData, setTraineeData] = useState();
    const [updatename, setUpdateName] = useState(false);
    const [deleteTrainee, setDeleteTrainee] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [profile, setProfile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [validImage, setValidImage] = useState({
        status: true,
        message: ''
    });

    const [uploading, setUploading] = useState(false);

    const FetchUsers = async () => {
        var Api = Connections.api + Connections.trainee + '/' + state.id;

        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data;
            setTraineeData(data);
        }
    };

    useQuery(['data'], () => FetchUsers(), {
        refetchOnWindowFocus: false
    });

    //lets work on profile picture update
    const PickProfile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfile(file);

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
        }

        const validated = ProfileValidator(file, sizes.image);

        if (validated.size) {
            handleProfileUpdate(file);
        }

        setValidImage({
            status: validated.size,
            message: validated.message
        });
    };

    //Update trainee profile
    const handleProfileUpdate = (image) => {
        setUploading(true);
        const Api = Connections.api + Connections.updateProfile + traineeData.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('profile', image);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setUploading(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setUploading(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setUploading(false);
                handlePrompts(error, 'error');
            });
    };

    //a handle trainee name update
    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.traineename + '/' + traineeData.user_id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('name', values.name);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    setUpdateName(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                handlePrompts(error, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            name: state.name ? state.name : state.user_name ? state.user_name : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(formik.isSubmitting);

    //the following function handles delete trainee functionality
    const DeleteTrainee = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainee + '/' + state.id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, {
            method: 'DELETE',
            headers: headers
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setDeleting(false);
                    setDeleteTrainee(false);
                    handlePrompts(response.message, 'success');
                    navigate(-1);
                } else {
                    handlePrompts(response.message, 'error');
                    setDeleting(false);
                }
            })
            .catch((error) => {
                setDeleting(false);
                handlePrompts(error.message, 'error');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
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
                lg={6}
                xl={6}
                sx={{
                    marginBottom: 2,
                    minHeight: '70vh',
                    border: 1,
                    borderColor: theme.palette.primary[200],
                    borderRadius: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                        minHeight: 140,
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        padding: 1
                    }}
                >
                    <IconButton onClick={() => navigate(-1)}>
                        <IconArrowLeft color={theme.palette.grey[500]} />
                    </IconButton>

                    <ActionMenu>
                        <Box>
                            <MenuItem onClick={() => navigate('/trainee/update', { state: traineeData })}>
                                <ListItemIcon>
                                    <IconEdit size={18} />
                                </ListItemIcon>
                                Update
                            </MenuItem>
                            <Divider />

                            <MenuItem onClick={() => setDeleteTrainee(true)} sx={{ color: theme.palette.error.main }}>
                                <ListItemIcon sx={{ color: theme.palette.error.main }}>
                                    <IconTrash size={18} />
                                </ListItemIcon>
                                Delete
                            </MenuItem>
                        </Box>
                    </ActionMenu>
                </Box>

                <Grid container marginTop={-10}>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: 1,
                            borderColor: theme.palette.secondary.light,
                            background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`
                        }}
                    >
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                ActiveUser.user.role === 'Trainee' && (
                                    <IconButton onClick={() => PickProfile()} sx={{ backgroundColor: theme.palette.background.default }}>
                                        {uploading ? (
                                            <CircularProgress size={14} sx={{ color: theme.palette.primary.main }} />
                                        ) : (
                                            <IconCamera size={18} />
                                        )}
                                    </IconButton>
                                )
                            }
                        >
                            {profile ? (
                                <Avatar
                                    alt="Trainee profile"
                                    src={previewImage}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: 2,
                                        borderColor: theme.palette.background.default,
                                        marginBottom: 1
                                    }}
                                />
                            ) : (
                                <Avatar
                                    alt={formik.values.name}
                                    src={traineeData && ImageApi + traineeData.profile}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: 2,
                                        borderColor: theme.palette.background.default,
                                        marginBottom: 1
                                    }}
                                />
                            )}
                        </Badge>

                        <input name="profile" type="file" id="profile" hidden ref={fileInputRef} onChange={handleFileChange} />

                        {updatename ? (
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <TextField
                                                id="name"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                variant="standard"
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.name}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <IconButton type="submit" sx={{ boxShadow: 1 }}>
                                            {isSubmitting ? (
                                                <CircularProgress size={14} sx={{ color: theme.palette.primary.main }} />
                                            ) : (
                                                <IconCheck size={16} color={theme.palette.primary.main} />
                                            )}
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </form>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Typography variant="h3" sx={{ marginY: 0.5 }}>
                                    {formik.values.name}
                                </Typography>
                                {ActiveUser.user.role === 'Trainee' && (
                                    <IconButton onClick={() => setUpdateName(true)}>
                                        <IconEdit size={20} />
                                    </IconButton>
                                )}
                            </Box>
                        )}

                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            {state.email ? state.email : state.user_email}
                        </Typography>

                        {!validImage.status && (
                            <Typography variant="body2" sx={{ marginBottom: 2, color: theme.palette.error.dark }}>
                                {validImage.message}
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                <DetailTabs
                    details={traineeData && <DetailContent data={traineeData} />}
                    training={<Typography>List of Training</Typography>}
                />
            </Grid>

            <SnackbarProvider maxSnack={3} />

            {deleteTrainee && (
                <Delete
                    type="Delete"
                    open={deleteTrainee}
                    title="Deleting Trainee"
                    description={`Are you sure you want to delete the trainee profile. Note, This action will remove all data related to this trainee`}
                    onNo={() => setDeleteTrainee(false)}
                    onYes={() => DeleteTrainee()}
                    deleting={deleting}
                    handleClose={() => setDeleteTrainee(false)}
                />
            )}
        </Grid>
    );
};

export default TraineeDetails;

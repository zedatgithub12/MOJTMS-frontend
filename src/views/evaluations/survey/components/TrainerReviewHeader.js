import { useEffect, useState } from 'react';
import { IconButton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { FormattedRound, ReadMore } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import ChangeStatus from 'ui-component/ChangeStatus';
import Connections from 'api';

//============================= TRAINER REVIEW HEADER COMPONENT =========================//

const letterConfig = {
    startfrom: 0,
    endat: 500
};

const SurveyStatus = ['ongoing', 'completed'];

const TrainerReviewHeader = ({ surveyID, back, trainer, session, round, title, description, status }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [collapse, setCollapse] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const ExpndText = () => {
        setCollapse(!collapse);
    };

    //handle status change
    const handleStatusChange = (index) => {
        const selectedStatus = SurveyStatus[index];
        handleSessionStatus(selectedStatus);
    };

    // Handle survey status change here
    const handleSessionStatus = (newStatus) => {
        setIsUpdating(true);
        const Api = Connections.api + Connections.trainersurveys + '/status/' + surveyID;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const formData = new FormData();
        formData.append('status', newStatus);

        fetch(Api, { method: 'POST', headers: headers, body: formData })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    const index = SurveyStatus.findIndex((item) => item === newStatus);
                    setSelectedIndex(index);

                    handlePrompts(response.message, 'success');
                    setIsUpdating(false);
                } else {
                    handlePrompts(response.message, 'error');
                    setIsUpdating(false);
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
                setIsUpdating(false);
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    useEffect(() => {
        const index = SurveyStatus.findIndex((item) => item === status);
        setSelectedIndex(index);
    }, [status]);
    return (
        <Box
            sx={{
                border: 1,
                borderColor: theme.palette.primary[200],
                borderRadius: 2,
                backgroundColor: theme.palette.primary[200],
                paddingY: 1.6,
                paddingX: 2.2,
                marginTop: 1.6
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onClick={() => navigate(-1)}
                >
                    {back && (
                        <IconButton>
                            <IconArrowLeft size={22} />
                        </IconButton>
                    )}
                    <Typography variant="subtitle1" sx={{ marginLeft: 1, cursor: 'pointer' }}>
                        {t('Back')}
                    </Typography>
                </Box>

                <ChangeStatus
                    options={SurveyStatus}
                    onPress={(event, index) => handleStatusChange(index)}
                    selectedIndex={selectedIndex}
                    isUpdating={isUpdating}
                />
            </Box>

            <Box marginY={1}>
                {session && <Typography variant="subtitle1">{t(session)}</Typography>}
                <Typography variant="subtitle2">{t('Training session')}</Typography>
            </Box>
            <Box marginY={1}>
                {round && (
                    <Typography variant="subtitle1">
                        {round}
                        {t(FormattedRound(round))}
                    </Typography>
                )}
                <Typography variant="subtitle2">{t('Round')}</Typography>
            </Box>

            <Box marginY={1}>
                {trainer && <Typography variant="subtitle1">{t(trainer)}</Typography>}
                <Typography variant="subtitle2">{t('Trainer')}</Typography>
            </Box>

            <Box marginY={1}>
                {title && <Typography variant="subtitle1">{t(title)}</Typography>}
                <Typography variant="subtitle2">{t('Survey')}</Typography>
            </Box>

            {description && (
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1 }}>
                    <Typography variant="subtitle2">
                        {t(ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse))}
                    </Typography>

                    {description.length > letterConfig.endat && (
                        <Typography onClick={() => ExpndText()} sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}>
                            {collapse ? t('Read More') : t('Read Less')}
                        </Typography>
                    )}
                </Box>
            )}

            <SnackbarProvider maxSnack={3} />
        </Box>
    );
};

TrainerReviewHeader.propTypes = {
    surveyID: PropTypes.number,
    back: PropTypes.bool,
    trainer: PropTypes.string,
    session: PropTypes.string,
    round: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string
};
export default TrainerReviewHeader;

import { useState } from 'react';
import { IconButton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ReadMore } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

//============================= SURVEY HEADER COMPONENT =========================//

const letterConfig = {
    startfrom: 0,
    endat: 500
};

const SurveyHeader = ({ back, name, description }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [collapse, setCollapse] = useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    return (
        <Box
            sx={{
                border: 1,
                borderColor: theme.palette.primary[200],
                borderRadius: 2,
                backgroundColor: theme.palette.primary.light,
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
                >
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft size={22} />
                        </IconButton>
                    )}

                    {name && (
                        <Typography variant="h4" sx={{ marginLeft: 1, cursor: 'pointer' }}>
                            {t(name)}
                        </Typography>
                    )}
                </Box>
            </Box>
            {description && (
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1 }}>
                    <Typography variant="body2">
                        {t(ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse))}
                    </Typography>

                    {description.length > letterConfig.endat && (
                        <Typography onClick={() => ExpndText()} sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}>
                            {collapse ? t('Read More') : t('Read Less')}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

SurveyHeader.propTypes = {
    back: PropTypes.bool,
    name: PropTypes.string,
    description: PropTypes.string
};
export default SurveyHeader;

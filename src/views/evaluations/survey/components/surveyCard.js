import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { ReadMore } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

//============================= SURVEY LISTING CARD =========================//

const letterConfig = {
    startfrom: 0,
    endat: 180
};

const SurveyCard = ({ title, description, onClick, status, sx }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [collapse, setCollapse] = useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    return (
        <Box
            sx={{
                border: 2,
                borderColor: theme.palette.primary[200],
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2,
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
                {title && (
                    <Typography variant="h4" onClick={onClick} sx={{ cursor: 'pointer' }}>
                        {t(title)}
                    </Typography>
                )}
            </Box>

            {description && (
                <Box sx={{ display: 'flex', flexDirection: 'column', marginY: 1 }}>
                    <Typography variant="body2">
                        {t(ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse))}
                    </Typography>

                    {description.length > letterConfig.endat && (
                        <Typography
                            component={'div'}
                            onClick={() => ExpndText()}
                            sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}
                        >
                            {collapse ? t('Read More') : t('Read Less')}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

SurveyCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    score: PropTypes.number,
    duration: PropTypes.number,
    instruction: PropTypes.string,
    status: PropTypes.string,
    onClick: PropTypes.func,
    sx: PropTypes.object
};
export default SurveyCard;

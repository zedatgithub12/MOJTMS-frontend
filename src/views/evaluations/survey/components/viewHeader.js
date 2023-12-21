import { Button, IconButton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconArrowLeft } from '@tabler/icons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import { ReadMore } from 'utils/functions';

//============================= SURVEY VIEW HEADER =========================//

const letterConfig = {
    startfrom: 0,
    endat: 180
};

const SurveyViewHeader = ({ back, title, description, onClick, status, onPublish, option, optionChildrens, publishing, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();

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

                    {title && (
                        <Typography variant="h4" onClick={onClick} sx={{ marginLeft: 1, cursor: 'pointer' }}>
                            {title}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    {status && status === 'draft' && publishing !== 'done' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onPublish}
                            sx={{ marginLeft: 2, paddingX: 4 }}
                            disabled={publishing === 'processing' ? true : false}
                        >
                            Publish
                        </Button>
                    )}

                    {option && <ActionMenu>{optionChildrens}</ActionMenu>}
                </Box>
            </Box>

            {description && (
                <Box sx={{ display: 'flex', flexDirection: 'column', marginY: 3 }}>
                    <Typography variant="body2">{ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse)}</Typography>

                    {description.length > letterConfig.endat && (
                        <Typography
                            component={'div'}
                            onClick={() => ExpndText()}
                            sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}
                        >
                            {collapse ? 'Read More' : 'Read Less'}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

SurveyViewHeader.propTypes = {
    back: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    onPublish: PropTypes.func,
    option: PropTypes.bool,
    optionChildrens: PropTypes.node,
    onClick: PropTypes.func,
    sx: PropTypes.object,
    publishing: PropTypes.string
};
export default SurveyViewHeader;

import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ActionMenu } from 'ui-component/menu/action';
import { ReadMore } from 'utils/functions';

//============================= ASSESSMENT LISTING CARD =========================//

const letterConfig = {
    startfrom: 0,
    endat: 180
};

const AssessmentCard = ({ name, description, score, duration, instruction, onClick, status, sx }) => {
    const theme = useTheme();

    const [collapse, setCollapse] = useState(true);
    const [openInstruction, setOpenInstruction] = useState(false);

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
                {name && (
                    <Typography variant="h4" onClick={onClick} sx={{ cursor: 'pointer' }}>
                        {name}
                    </Typography>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    {score && (
                        <Typography
                            variant="subtitle1"
                            sx={{
                                backgroundColor: theme.palette.warning.light,
                                padding: 0.8,
                                border: 1,
                                borderColor: theme.palette.warning.main,
                                borderRadius: 2,
                                marginRight: 0.8
                            }}
                        >
                            {score}%
                        </Typography>
                    )}
                    {duration && (
                        <Typography
                            variant="subtitle1"
                            sx={{
                                backgroundColor: theme.palette.primary[200],
                                padding: 0.8,
                                border: 1,
                                borderColor: theme.palette.primary[200],
                                borderRadius: 2
                            }}
                        >
                            {duration}
                        </Typography>
                    )}
                </Box>
            </Box>

            {description && (
                <Box sx={{ display: 'flex', flexDirection: 'column', marginY: 1 }}>
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

            {instruction && (
                <Box paddingTop={1}>
                    <Button variant="text" color="primary" onClick={() => setOpenInstruction(!openInstruction)}>
                        Instructions {openInstruction ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                    </Button>

                    {openInstruction && (
                        <Typography variant="body2" sx={{ padding: 1 }}>
                            {instruction}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

AssessmentCard.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    score: PropTypes.number,
    duration: PropTypes.number,
    instruction: PropTypes.string,
    status: PropTypes.string,
    onClick: PropTypes.func,
    sx: PropTypes.object
};
export default AssessmentCard;

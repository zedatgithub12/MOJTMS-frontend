import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconBooks, IconSchool } from '@tabler/icons';
import { letterLength } from 'constants';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ReadMore } from 'utils/functions';

const TopContents = ({ training, module, description }) => {
    const theme = useTheme();

    const [collapse, setCollapse] = useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    return (
        <Box
            sx={{
                paddingX: 4,
                paddingTop: 3,
                backgroundColor: theme.palette.primary.light,
                borderBottom: 1,
                borderColor: theme.palette.secondary.light
            }}
        >
            {training && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IconSchool size={24} />
                    <Typography variant="subtitle1" sx={{ marginLeft: 3 }}>
                        {training}
                    </Typography>
                </Box>
            )}

            {module && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2 }}>
                    <IconBooks size={24} />
                    <Typography variant="subtitle1" sx={{ marginLeft: 3 }}>
                        {module}
                    </Typography>
                </Box>
            )}

            {description && (
                <Box sx={{ display: 'flex', flexDirection: 'row', marginY: 2.6 }}>
                    <Box>
                        <Typography variant="subtitle2">Module description</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">
                                {ReadMore(description, letterLength.startfrom, letterLength.endat, collapse)}
                            </Typography>

                            {description.length > letterLength.endat && (
                                <Typography
                                    component={'div'}
                                    onClick={() => ExpndText()}
                                    sx={{ marginTop: 1, color: theme.palette.primary.main }}
                                >
                                    {collapse ? 'Read More' : 'Read Less'}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

TopContents.propTypes = {
    training: PropTypes.string,
    module: PropTypes.string,
    description: PropTypes.string
};
export default TopContents;

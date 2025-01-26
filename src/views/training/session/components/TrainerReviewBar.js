import { LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';

const TrainerReviewBar = ({ ratingCounts, totalCount }) => {
    return (
        <div>
            {ratingCounts.map((rating, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', marginY: 0.5 }}>
                    <Typography variant="body2" marginRight={2}>
                        {rating.type}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingY: 1 }}>
                        <Box width={'96%'}>
                            <LinearProgress
                                variant="determinate"
                                color="primary"
                                value={(rating.count / totalCount) * 100}
                                sx={{ padding: 0.3, borderRadius: 2 }}
                            />
                        </Box>
                        <Typography variant="body2" ml={1}>
                            {((rating.count / totalCount) * 100).toFixed(1)}%
                        </Typography>
                    </Box>
                </Box>
            ))}
        </div>
    );
};

TrainerReviewBar.propTypes = {
    ratingCounts: PropTypes.number,
    totalCount: PropTypes.number
};

export default TrainerReviewBar;

import React from 'react';
import { LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';

const RatingProgressBarList = ({ ratingCounts, totalCount }) => {
    return (
        <div>
            {ratingCounts.map((rating, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 0.5 }}>
                    <Typography variant="subtitle1" marginRight={2}>
                        {rating.type}
                    </Typography>
                    <Box width={'90%'}>
                        <LinearProgress
                            variant="determinate"
                            color="secondary"
                            value={(rating.count / totalCount) * 100}
                            sx={{ padding: 0.5, borderRadius: 2 }}
                        />
                    </Box>
                </Box>
            ))}
        </div>
    );
};

export default RatingProgressBarList;

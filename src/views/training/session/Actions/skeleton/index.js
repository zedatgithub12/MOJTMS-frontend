import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/system';

// ==============================|| SKELETON - ACTION CARDS ||============================== //

const SessionActionsSkeleton = () => {
    return (
        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Skeleton variant="rectangular" width={'76%'} height={12} sx={{ marginTop: 2 }} />
            <Skeleton variant="rectangular" width={'36%'} height={8} sx={{ marginTop: 0.6 }} />
            <Skeleton variant="rectangular" width={'56%'} height={46} sx={{ marginTop: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={'56%'} height={8} sx={{ marginTop: 1 }} />
        </Box>
    );
};

export default SessionActionsSkeleton;

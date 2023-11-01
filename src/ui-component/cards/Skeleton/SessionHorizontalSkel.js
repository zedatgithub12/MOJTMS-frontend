// material-ui
import { Box, Grid, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// ==============================|| SKELETON - SESSION HORIZONTAL ||============================== //

const SessionHorizontalSkel = () => {
    const theme = useTheme();
    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                border: '1px solid',
                borderColor: theme.palette.secondary.light,
                borderRadius: 3,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                <Skeleton variant="rectangular" width={'100%'} height={200} sx={{ borderBottomLeftRadius: 2, borderTopLeftRadius: 2 }} />
            </Grid>

            <Grid
                item
                xs={12}
                sm={12}
                md={8}
                lg={9}
                xl={9}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingY: 1.2
                }}
            >
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ borderRightWidth: 4, borderColor: theme.palette.primary.main }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Skeleton variant="rectangular" width={'60%'} height={8} sx={{ borderRadius: 2, margin: 0.5, marginX: 2 }} />
                        </Box>
                        <Skeleton variant="rectangular" width={'92%'} height={20} sx={{ marginX: 2, borderRadius: 2, marginY: 1 }} />

                        <Skeleton variant="rectangular" width={'92%'} height={8} sx={{ borderRadius: 2, margin: 0.8, marginX: 2 }} />
                        <Skeleton variant="rectangular" width={'92%'} height={8} sx={{ borderRadius: 2, margin: 0.8, marginX: 2 }} />
                        <Skeleton variant="rectangular" width={'50%'} height={8} sx={{ borderRadius: 2, margin: 0.8, marginX: 2 }} />

                        <Box sx={{ width: '96%', display: 'flex', flexDirection: 'row', margin: 2 }}>
                            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                <Skeleton variant="rectangular" width={26} height={24} sx={{ borderRadius: 2 }} />

                                <Box sx={{ paddingX: 2, width: '100%' }}>
                                    <Skeleton variant="rectangular" width={'72%'} height={12} sx={{ borderRadius: 2, margin: 0.8 }} />
                                    <Skeleton variant="rectangular" width={'50%'} height={8} sx={{ borderRadius: 2, margin: 0.8 }} />
                                </Box>
                            </Box>

                            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                <Skeleton variant="rectangular" width={26} height={24} sx={{ borderRadius: 2 }} />

                                <Box sx={{ paddingX: 2, width: '100%' }}>
                                    <Skeleton variant="rectangular" width={'72%'} height={12} sx={{ borderRadius: 2, margin: 0.8 }} />
                                    <Skeleton variant="rectangular" width={'50%'} height={8} sx={{ borderRadius: 2, margin: 0.8 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                paddingX: 2
                            }}
                        >
                            <Box sx={{ width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                <Skeleton variant="rectangular" width={26} height={22} sx={{ borderRadius: 2 }} />

                                <Box sx={{ paddingX: 2, width: '100%' }}>
                                    <Skeleton variant="rectangular" width={'92%'} height={12} sx={{ borderRadius: 2, margin: 0.8 }} />
                                    <Skeleton variant="rectangular" width={'70%'} height={8} sx={{ borderRadius: 2, margin: 0.8 }} />
                                </Box>
                            </Box>

                            <Box sx={{ width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                <Skeleton variant="rectangular" width={26} height={22} sx={{ borderRadius: 2 }} />

                                <Box sx={{ paddingX: 2, width: '100%' }}>
                                    <Skeleton variant="rectangular" width={'92%'} height={12} sx={{ borderRadius: 2, margin: 0.8 }} />
                                    <Skeleton variant="rectangular" width={'70%'} height={8} sx={{ borderRadius: 2, margin: 0.8 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SessionHorizontalSkel;

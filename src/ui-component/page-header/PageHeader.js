import { Grid, Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const PageHeader = ({ children, title, back, option, optionChildrens, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [customHeight, setCustomHeight] = useState('200px');
    const [isScrolledToTop, setIsScrolledToTop] = useState(true);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollPosition = window.scrollY;

    //         if (scrollPosition >= 3) {
    //             setCustomHeight('60px'); // Set the default height of the component here
    //             setIsScrolledToTop(true);
    //         } else {
    //             setIsScrolledToTop(false); // Set your desired smaller height here
    //             setCustomHeight('200px');
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    return (
        <Grid
            container
            sx={{
                transition: 'all 0.9s ease-in-out',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                ...sx
            }}
        >
            <Grid
                container
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: isScrolledToTop ? 'center' : 'flex-start',
                    paddingX: 2,
                    pt: 1
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: isScrolledToTop ? 'center' : 'flex-start' }}>
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft />
                        </IconButton>
                    )}

                    {/* <Typography
                        color={'white'}
                        variant="h4"
                        sx={{ opacity: isScrolledToTop ? 1 : 0, transition: 'opacity 0.8s ease-in-out', paddingX: 1 }}
                    >
                        {title}
                    </Typography> */}
                </Box>

                {option && <ActionMenu children={optionChildrens} />}
            </Grid>

            <Grid container justifyContent={'center'}>
                <Box
                    sx={{
                        alignSelf: 'center',
                        transition: 'opacity 0.8s ease-in-out',
                        paddingY: 1,
                        zIndex: 4,
                        overflow: 'hidden'
                    }}
                >
                    {children}
                </Box>
            </Grid>
        </Grid>
    );
};

PageHeader.propTypes = {
    back: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.node,
    option: PropTypes.bool,
    optionChildrens: PropTypes.node,
    sx: PropTypes.object
};

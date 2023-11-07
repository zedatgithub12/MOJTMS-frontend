import { Grid, Box, IconButton, Typography, useTheme } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const PageHeader = ({ children, title, back, option, optionChildrens, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [customHeight, setCustomHeight] = useState('160px');
    const [isScrolledToTop, setIsScrolledToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            if (scrollPosition === 0) {
                setCustomHeight('160px');
                setIsScrolledToTop(false); // Set your desired smaller height here
            } else {
                setCustomHeight('50px'); // Set the default height of the component here
                setIsScrolledToTop(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Grid
            container
            sx={{
                position: 'sticky',
                top: 98,
                height: customHeight,
                transition: 'height 0.3s ease-in-out',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                ...sx
            }}
        >
            <Grid
                container
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingX: 2 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft color={theme.palette.background.default} />
                        </IconButton>
                    )}

                    <Typography
                        color={'white'}
                        variant="h4"
                        sx={{ opacity: isScrolledToTop ? 1 : 0, transition: 'opacity 0.3s ease-in-out', paddingX: 1 }}
                    >
                        {title}
                    </Typography>
                </Box>

                {option && <ActionMenu children={optionChildrens} />}
            </Grid>

            <Grid container justifyContent={'center'}>
                <Box
                    sx={{
                        alignSelf: 'center',
                        opacity: isScrolledToTop ? 0 : 1,
                        transition: 'opacity 0.3s ease-in-out',
                        paddingY: 4,
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

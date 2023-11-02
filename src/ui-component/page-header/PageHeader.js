import { Grid, Box, IconButton, Typography, useTheme } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const PageHeader = ({ children, title, back, option, optionChildrens }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [customHeight, setCustomHeight] = useState('180px');
    const [isScrolledToTop, setIsScrolledToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            if (scrollPosition === 0) {
                setCustomHeight('180px');
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
                height: customHeight,
                transition: 'height 0.4s ease-in-out',
                backgroundColor: theme.palette.primary[200],
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
            }}
        >
            <Grid
                item
                xs={12}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft />
                        </IconButton>
                    )}

                    <Typography variant="h4" sx={{ opacity: isScrolledToTop ? 1 : 0, transition: 'opacity 0.4s ease-in-out', paddingX: 3 }}>
                        {title}
                    </Typography>
                </Box>

                {option && <ActionMenu children={optionChildrens} />}
            </Grid>
            <Grid
                item
                xs={12}
                sx={{ opacity: isScrolledToTop ? 0 : 1, transition: 'opacity 0.4s ease-in-out', padding: 4, zIndex: 4, overflow: 'hidden' }}
            >
                {children}
            </Grid>
        </Grid>
    );
};

PageHeader.propTypes = {
    back: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.node,
    option: PropTypes.bool,
    optionChildrens: PropTypes.node
};

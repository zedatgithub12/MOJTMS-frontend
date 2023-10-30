import * as React from 'react';
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import office from 'assets/images/office.jpg';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';
import { IconMail, IconPhone } from '@tabler/icons';

const CardFoundation = forwardRef(
    ({ children, content, contentClass, darkTitle, secondary, sx = {}, contentSX = {}, title, ...others }, ref) => {
        const theme = useTheme();
        return (
            <Card
                ref={ref}
                sx={{
                    width: 280,
                    border: '1px solid',
                    borderColor: theme.palette.secondary.light,
                    ':hover': {
                        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                    },
                    ...sx
                }}
                {...others}
            >
                <CardMedia sx={{ height: 140 }} image={office} title="Departments" />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Communication Department
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                        <IconMail size={18} /> <Typography sx={{ marginX: 1 }}>zerihuntegenu5@gmail.com</Typography>{' '}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <IconPhone size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>+251949390840</Typography>{' '}
                    </Box>
                </CardContent>
                <CardActions>
                    <Button size="small">Button 1</Button>
                    <Button size="small">Button 2</Button>
                </CardActions>
            </Card>
        );
    }
);

CardFoundation.propTypes = {
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    sx: PropTypes.object,
    contentSX: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

CardFoundation.defaultProps = {
    content: true
};

export default CardFoundation;

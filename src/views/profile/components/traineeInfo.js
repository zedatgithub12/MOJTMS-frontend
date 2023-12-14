import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const ListingComponent = ({ content, label }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginY: 2,
            paddingX: 3
        }}
    >
        <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
            {content}
        </Typography>
        <Typography color="grey"> {label} </Typography>
    </Box>
);

const TraineeInfo = ({ onEdit }) => {
    const theme = useTheme();

    return (
        <Grid
            container
            sx={{
                borderRadius: 2,
                border: 1,
                borderColor: theme.palette.grey[300],
                // backgroundColor: theme.palette.grey[100],
                marginY: 2
            }}
        >
            <Grid item xs={12} marginBottom={2}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="h4">More details</Typography>
                    <Button onClick={onEdit}>Edit</Button>
                </Box>
                <Divider />

                <ListingComponent content={'12/2/1998'} label="Birth date" />
                <ListingComponent content={'Male'} label="Gender" />
                <ListingComponent content={'+25193247934'} label="Phone" />
                <ListingComponent content={'Bole 22, Addis Ababa'} label="Address" />
                <ListingComponent content={'BSc Degree'} label="Education Level" />
                <ListingComponent content={'Full stack engineer'} label="Job Title" />
                <ListingComponent content={'13/12/2023'} label="Joined on" />
            </Grid>
        </Grid>
    );
};

export default TraineeInfo;

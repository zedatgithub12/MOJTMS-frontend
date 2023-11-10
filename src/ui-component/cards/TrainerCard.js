import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme, Stack, Link, Rating } from '@mui/material';
import { IconCertificate, IconChalkboard, IconMapPin, IconUser } from '@tabler/icons';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TrainerCardSkel from './Skeleton/TrainerCardSkel';

const TrainerCard = forwardRef(
    (
        { sx = {}, isLoading, image, name, qualification, address, gender, title, linkedin, trainingcount, rating, onPress, ...others },
        ref
    ) => {
        const theme = useTheme();
        return (
            <>
                {isLoading ? (
                    <TrainerCardSkel />
                ) : (
                    <Card
                        onClick={onPress}
                        ref={ref}
                        sx={{
                            width: 280,
                            margin: 1.2,
                            border: '1px solid',
                            borderColor: theme.palette.secondary.light,
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            },
                            ...sx
                        }}
                        {...others}
                    >
                        <Grid container>
                            <Box
                                sx={{
                                    width: '50%',
                                    height: 140,
                                    borderBottomRightRadius: 2,
                                    border: '1px solid',
                                    borderColor: theme.palette.secondary.light
                                }}
                            >
                                <CardMedia
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 1
                                    }}
                                    image={image}
                                    title="Trainer photo"
                                />
                            </Box>
                            <Stack paddingTop={0.5}>
                                {address && (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', padding: 1 }}>
                                        <IconMapPin size={18} />
                                        <Typography sx={{ marginX: 1 }}>{address}</Typography>
                                    </Box>
                                )}

                                {gender && (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', padding: 1 }}>
                                        <IconUser size={18} />
                                        <Typography sx={{ marginX: 1 }}>{gender}</Typography>{' '}
                                    </Box>
                                )}

                                {qualification && (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', padding: 1 }}>
                                        <IconCertificate size={18} />
                                        <Typography sx={{ marginX: 1 }}>{qualification}</Typography>{' '}
                                    </Box>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item paddingX={1.5}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 1
                                }}
                            >
                                <Typography variant="body2"> {name} </Typography>

                                {linkedin && (
                                    <Link href={linkedin}>
                                        <LinkedInIcon color="secondary" />
                                    </Link>
                                )}
                            </Box>

                            <Box marginY={1}>
                                <Typography variant="h3"> {title}</Typography>
                            </Box>
                            <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                {trainingcount && (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconChalkboard size={18} />
                                        <Typography variant="h5" marginLeft={1}>
                                            {trainingcount}
                                        </Typography>
                                    </Box>
                                )}

                                <Stack flexDirection="column">
                                    {rating ? (
                                        <Rating name="read-only" value={rating} readOnly />
                                    ) : (
                                        <Typography variant="subtitle2">No rating yet</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Grid>
                    </Card>
                )}
            </>
        );
    }
);

TrainerCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    qualification: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    linkedin: PropTypes.string,
    trainingcount: PropTypes.number,
    rating: PropTypes.number,
    onPress: PropTypes.func
};

export default TrainerCard;

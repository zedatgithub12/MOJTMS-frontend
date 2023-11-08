import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme, Stack, Link } from '@mui/material';
import { IconCertificate, IconMail, IconMapPin, IconPhone, IconUser } from '@tabler/icons';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacilitatorCardSkel from './Skeleton/FacilitatorCardSkel';

const FacilitatorCard = forwardRef(
    ({ sx = {}, isLoading, image, name, qualification, address, gender, title, linkedin, email, phone, onPress, ...others }, ref) => {
        const theme = useTheme();
        return (
            <>
                {isLoading ? (
                    <FacilitatorCardSkel />
                ) : (
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
                        onClick={onPress}
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
                                        borderTopLeftRadius: 2,
                                        borderRadius: 1
                                    }}
                                    image={image}
                                    title="Facilitator photo"
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

                            {email && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconMail size={18} /> <Typography sx={{ marginX: 1 }}>{email}</Typography>{' '}
                                </Box>
                            )}

                            {phone && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2.4 }}>
                                    <IconPhone size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>{phone}</Typography>{' '}
                                </Box>
                            )}
                        </Grid>
                    </Card>
                )}
            </>
        );
    }
);

FacilitatorCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    qualification: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    linkedin: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    onPress: PropTypes.func
};

export default FacilitatorCard;

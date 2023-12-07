import React, { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme, Stack, Link, Avatar } from '@mui/material';
import { IconCertificate, IconMail, IconMapPin, IconPhone, IconUser } from '@tabler/icons';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacilitatorCardSkel from './Skeleton/FacilitatorCardSkel';

const FacilitatorCard = forwardRef(
    ({ sx = {}, isLoading, image, name, qualification, address, gender, title, linkedin, email, phone, ...others }, ref) => {
        const theme = useTheme();
        return (
            <React.Fragment>
                {isLoading ? (
                    <FacilitatorCardSkel />
                ) : (
                    <Card
                        ref={ref}
                        sx={{
                            minWidth: 280,
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
                                    height: 200,
                                    width: '100%',
                                    borderBottomRightRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.palette.primary[200]
                                }}
                            >
                                {image ? (
                                    <CardMedia
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderTopLeftRadius: 2,
                                            borderRadius: 1,
                                            aspectRatio: 16 / 9
                                        }}
                                        image={image}
                                        title="coordinator photo"
                                    />
                                ) : (
                                    <Avatar sizes="80">
                                        <IconUser size={36} />
                                    </Avatar>
                                )}
                            </Box>
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
                                <Typography variant="subtitle"> {title} </Typography>

                                {linkedin && (
                                    <Link href={linkedin}>
                                        <LinkedInIcon color="secondary" />
                                    </Link>
                                )}
                            </Box>

                            <Box marginY={1}>
                                <Typography variant="h3"> {name}</Typography>
                            </Box>
                            {email && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconMail size={18} /> <Typography sx={{ marginX: 1 }}>{email}</Typography>{' '}
                                </Box>
                            )}
                            {gender && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconUser size={18} />
                                    <Typography sx={{ marginX: 1 }}>{gender}</Typography>{' '}
                                </Box>
                            )}

                            {phone && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2.4 }}>
                                    <IconPhone size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>{phone}</Typography>{' '}
                                </Box>
                            )}
                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconMapPin size={18} />
                                    <Typography sx={{ marginX: 1 }}>{address}</Typography>
                                </Box>
                            )}

                            {qualification && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconCertificate size={18} />
                                    <Typography sx={{ marginX: 1 }}>{qualification}</Typography>{' '}
                                </Box>
                            )}
                        </Grid>
                    </Card>
                )}
            </React.Fragment>
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

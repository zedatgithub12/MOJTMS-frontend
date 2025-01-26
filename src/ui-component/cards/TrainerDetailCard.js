import * as React from 'react';
import { forwardRef } from 'react';
import { Box, Link, useTheme } from '@mui/material';
import { IconLanguage, IconMail, IconMapPin, IconPhone, IconSchool, IconUser } from '@tabler/icons';
import { ReadMore } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import TrainerDetailsCardSkel from './Skeleton/TrainerDetailCardSkel';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Placeholder from 'assets/images/placeholder.jpg';

const letterConfig = {
    startfrom: 0,
    endat: 150
};

const TrainerDetailCard = forwardRef(
    (
        {
            sx = {},
            isLoading,
            image,
            title,
            specialisation,
            gender,
            email,
            phone,
            address,
            qualification,
            language,
            linkedin,
            bio,
            onPress,
            ...others
        },
        ref
    ) => {
        const { t } = useTranslation();
        const theme = useTheme();

        const [collapse, setCollapse] = React.useState(true);

        const ExpndText = () => {
            setCollapse(!collapse);
        };

        return (
            <React.Fragment>
                {isLoading ? (
                    <TrainerDetailsCardSkel />
                ) : (
                    <Card
                        onClick={onPress}
                        ref={ref}
                        sx={{
                            width: 320,
                            border: '1px solid',
                            borderColor: theme.palette.secondary.light,
                            cursor: 'pointer',
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            },
                            ...sx
                        }}
                        {...others}
                    >
                        {image ? (
                            <CardMedia sx={{ height: 200 }} image={image} title={t(title)} />
                        ) : (
                            <CardMedia sx={{ height: 200 }} image={Placeholder} title={t(title)} />
                        )}

                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 1
                                }}
                            >
                                <Typography gutterBottom variant="h4" component="div">
                                    {t(title)}
                                </Typography>

                                {linkedin && (
                                    <Link href={linkedin}>
                                        <LinkedInIcon color="secondary" />
                                    </Link>
                                )}
                            </Box>
                            {gender && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconUser size={18} />{' '}
                                        <Typography sx={{ marginX: 1, textTransform: 'capitalize' }}>{gender}</Typography>{' '}
                                    </Box>
                                    <Typography variant="subtitle2">{t('Gender')}</Typography>
                                </Box>
                            )}

                            {specialisation && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <VerifiedOutlinedIcon fontSize="small" />{' '}
                                        <Typography sx={{ marginX: 1 }}>{t(specialisation)}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2">{t('Trainer specialisation')}</Typography>
                                </Box>
                            )}

                            {qualification && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconSchool size={18} sx={{ marginRight: 2 }} />{' '}
                                        <Typography sx={{ marginX: 1 }}>{qualification}</Typography>{' '}
                                    </Box>

                                    <Typography variant="subtitle2">{t('Education Level')}</Typography>
                                </Box>
                            )}

                            {email && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconMail size={18} /> <Typography sx={{ marginX: 1 }}>{email}</Typography>{' '}
                                    </Box>

                                    <Typography variant="subtitle2">{t('Email addres')}</Typography>
                                </Box>
                            )}

                            {phone && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconPhone size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>{phone}</Typography>{' '}
                                    </Box>
                                    <Typography variant="subtitle2">{t('Phone')}</Typography>
                                </Box>
                            )}

                            {language && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconLanguage size={18} sx={{ marginRight: 2 }} />{' '}
                                        <Typography sx={{ marginX: 1 }}>{t(language)}</Typography>{' '}
                                    </Box>
                                    <Typography variant="subtitle2">{t('Primary language')}</Typography>
                                </Box>
                            )}

                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconMapPin size={18} sx={{ marginRight: 2 }} />
                                        <Typography sx={{ marginX: 1 }}>{t(address)}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2">{t('Address')}</Typography>
                                </Box>
                            )}

                            {bio && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                                    <Typography variant="subtitle2">{t('Bio')}</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography>{t(ReadMore(bio, letterConfig.startfrom, letterConfig.endat, collapse))}</Typography>

                                        {bio.length > letterConfig.endat && (
                                            <Typography
                                                component={'div'}
                                                onClick={() => ExpndText()}
                                                sx={{ marginTop: 1, color: theme.palette.primary.main }}
                                            >
                                                {collapse ? t('Read More') : t('Read Less')}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}
            </React.Fragment>
        );
    }
);

TrainerDetailCard.propTypes = {
    sx: PropTypes.object,
    contentSX: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.string,
    gender: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    specialisation: PropTypes.string,
    qualification: PropTypes.string,
    language: PropTypes.string,
    linkedin: PropTypes.string,
    trainingcount: PropTypes.number,
    traineecount: PropTypes.number,
    bio: PropTypes.string,
    onPress: PropTypes.func
};

export default TrainerDetailCard;

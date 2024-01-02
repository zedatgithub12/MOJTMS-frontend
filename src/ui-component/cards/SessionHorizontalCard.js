import { forwardRef } from 'react';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';
import { ActionMenu } from 'ui-component/menu/action';
import { FormattedRound } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import SessionHorizontalSkel from './Skeleton/SessionHorizontalSkel';

const SessionHorizontalCard = forwardRef(
    (
        {
            sx = {},
            isLoading,
            image,
            round,

            title,
            description,
            address,
            capacity,
            startdate,
            enddate,
            option,
            optionChildrens,
            onPress,
            ...others
        },
        ref
    ) => {
        const { t } = useTranslation();
        const theme = useTheme();
        const belowmd = useMediaQuery(theme.breakpoints.down('md'));

        return (
            <>
                {isLoading ? (
                    <SessionHorizontalSkel />
                ) : (
                    <Card
                        onClick={onPress}
                        ref={ref}
                        sx={{
                            border: '2px solid',
                            marginTop: 1,
                            borderColor: theme.palette.primary[200],
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            },
                            cursor: 'pointer',
                            ...sx
                        }}
                        {...others}
                    >
                        <Grid container sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                                {image ? (
                                    <CardMedia
                                        sx={{
                                            width: '100%',
                                            height: 160,
                                            borderRadius: 1
                                        }}
                                        image={image}
                                        title={t('Training Sessions')}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            minHeight: '100%',
                                            backgroundColor: theme.palette.primary[200],
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {round && (
                                            <Box>
                                                <Typography variant="h1" color="primary">
                                                    {round}
                                                    <sup>{t(FormattedRound(round))}</sup>
                                                </Typography>
                                                <Typography variant="subtitle1">{t('Round')}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
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
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={8}
                                        xl={8}
                                        sx={{ borderRightWidth: 4, borderColor: theme.palette.primary.main }}
                                    >
                                        {title && (
                                            <Typography variant="h2" sx={{ paddingX: 2, marginBottom: 1 }}>
                                                {t(title)}
                                            </Typography>
                                        )}

                                        {description && (
                                            <Typography variant="body2" sx={{ paddingX: 2 }}>
                                                {description.length > 120 ? description.slice(0, 120) + '...' : t(description)}
                                            </Typography>
                                        )}

                                        <Box
                                            sx={{
                                                paddingX: 2,
                                                display: 'flex',
                                                flexDirection: belowmd ? 'column' : 'row',
                                                marginY: 1
                                            }}
                                        >
                                            {capacity && (
                                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                                    <IconUsers size={18} />
                                                    <Box sx={{ paddingX: 2 }}>
                                                        <Typography variant="subtitle1">
                                                            {capacity} {t('Trainee')}{' '}
                                                        </Typography>
                                                        <Typography variant="subtitle2">{t('Maximum Capacity')} </Typography>
                                                    </Box>
                                                </Box>
                                            )}

                                            {address && (
                                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                                    <IconMapPin size={18} />
                                                    <Box sx={{ paddingX: 2 }}>
                                                        <Typography variant="subtitle1">{t(address)} </Typography>
                                                        <Typography variant="subtitle2">{t('Training address')} </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 1 }}>
                                            {option && <ActionMenu children={optionChildrens} />}
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: belowmd ? 'row' : 'column',
                                                alignItems: 'flex-start',
                                                paddingBottom: 2,
                                                marginTop: 1,
                                                paddingX: 2
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <IconClockPlay size={18} />
                                                <Box marginLeft={2}>
                                                    <Typography variant="subtitle2">{t('From')} </Typography>
                                                    <Typography variant="subtitle1">{startdate}</Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginLeft: belowmd ? 2 : 0
                                                }}
                                            >
                                                <IconClockStop size={18} />
                                                <Box marginLeft={2}>
                                                    <Typography variant="subtitle2">{t('To')} </Typography>
                                                    <Typography variant="subtitle1">{enddate}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                )}
            </>
        );
    }
);

SessionHorizontalCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    image: PropTypes.string,
    round: PropTypes.number,
    description: PropTypes.string,
    address: PropTypes.string,
    capacity: PropTypes.number,
    startdate: PropTypes.string,
    enddate: PropTypes.string,
    option: PropTypes.bool,
    onPress: PropTypes.func,
    optionChildrens: PropTypes.node
};

export default SessionHorizontalCard;

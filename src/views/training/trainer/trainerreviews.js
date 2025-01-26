import { useState } from 'react';
import { Grid, Box, Typography, CircularProgress, useTheme, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { useTranslation } from 'react-i18next';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import errorImage from 'assets/images/error.jpg';
import Connections from 'api';
import TrainerReviewBar from './components/TrainerReviewBar';
import TrainerReviewHeader from 'views/evaluations/survey/components/TrainerReviewHeader';
import * as XLSX from 'xlsx';
import { DateFormatter } from 'utils/functions';

const TrainerReviews = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalreviews, setTotalReviews] = useState(0);

    //handle data fetching
    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchReviews();
        } else {
            FetchReviews();
        }
    };

    const FetchReviews = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainerreview + '/' + state.id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed?.data;
            const reviewCount = parsed?.reviewCount;
            setData(data);
            setTotalReviews(reviewCount);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    const handleExportToExcel = () => {
        // Prepare the survey data for export
        const worksheetData = data.flatMap((question) => {
            return question.surveyoptions.map((option) => ({
                Question: question.question_text,
                Option_type: question.question_type,
                Selected_Option: option.option_text,
                Count_of_answers: ((option.trainer_review_count / totalreviews) * 100).toFixed(1) + '%',
                CreatedAt: DateFormatter(question.created_at),
                Last_Survey: DateFormatter(question.updated_at)
            }));
        });

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Trainer Survey Responses');

        // Generate Excel file and download
        XLSX.writeFile(workbook, 'TrainerSurveyResponses.xlsx');
    };
    return (
        <Grid container>
            <Grid
                item
                xs={12}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}
            >
                <Grid
                    item
                    xs={11}
                    sm={10}
                    md={10}
                    lg={8}
                    xl={8}
                    sx={{
                        marginBottom: 2,
                        minHeight: '90vh'
                    }}
                >
                    <TrainerReviewHeader
                        back={true}
                        surveyID={state.id}
                        title={t(state.title)}
                        description={t(state.description)}
                        trainer={t(state.name)}
                        session={t(state.round_name)}
                        round={t(state.round_number)}
                        status={state.status}
                    />

                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 3
                            }}
                        >
                            <CircularProgress size={22} />
                        </Box>
                    ) : error ? (
                        <ErrorPrompt
                            image={errorImage}
                            title="Server Error"
                            message="Oooops... There is server error fetching trainer reviews"
                            onPress={() => navigate(-1)}
                        />
                    ) : data.length == 0 ? (
                        <NoResult title="" message="Oooops... no review made yet" onPress={() => navigate(-1)} />
                    ) : (
                        <>
                            <Grid container marginTop={2}>
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box
                                        sx={{
                                            width: 'fit-content',
                                            padding: 1,
                                            paddingX: 2,
                                            border: 1,
                                            borderColor: theme.palette.primary[200],
                                            borderRadius: 1,
                                            display: 'flex'
                                        }}
                                    >
                                        <Typography variant="subtitle1">{totalreviews}</Typography>
                                        <Typography variant="body2" marginLeft={2}>
                                            {t('Reviews')}
                                        </Typography>
                                    </Box>

                                    <Button variant="contained" onClick={() => handleExportToExcel()}>
                                        Download Excel
                                    </Button>
                                </Grid>
                            </Grid>
                            {data?.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        marginTop: 4,
                                        paddingX: 3,
                                        paddingY: 1,
                                        borderRadius: 2,
                                        ':hover': {
                                            boxShadow: 1,
                                            transform: 'scale(1.0)',
                                            transition: 'all, 1s, ease-in-out'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginY: 4
                                        }}
                                    >
                                        <Typography variant="h4">{(index += 1)}.</Typography>
                                        <Typography variant="h4" marginLeft={1.6}>
                                            {item.question_text}
                                        </Typography>
                                    </Box>
                                    {item?.surveyoptions?.map((option, index) => (
                                        <TrainerReviewBar
                                            key={index}
                                            ratingCounts={[{ type: option.option_text, count: option.trainer_review_count }]}
                                            totalCount={item.total_answers}
                                        />
                                    ))}
                                </Box>
                            ))}
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TrainerReviews;

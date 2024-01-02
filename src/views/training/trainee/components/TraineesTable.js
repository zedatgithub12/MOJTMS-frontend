import { TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, useTheme, Box, Typography } from '@mui/material';
import { DateFormatter, FormattedRound, calculateAge } from 'utils/functions';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const columns = ['Name', 'Email', 'Gender', 'Age', 'Department', 'Job Title', 'Round', 'Pre Assessment', 'Post Assessment', 'Enrolled on'];

export default function TraineesTable({ rows }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="trainees table">
                <TableHead sx={{ backgroundColor: theme.palette.primary[200] }}>
                    <TableRow>
                        {columns.map((item, index) => (
                            <TableCell key={index}>{t(item)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate('/trainee/details', { state: { ...row, id: row.trainee_id } })}
                        >
                            <TableCell component="th" scope="row">
                                <Typography variant="subtitle1">{row.name}</Typography>
                            </TableCell>
                            <TableCell>{row.email ? row.email : 'N/A'}</TableCell>
                            <TableCell>{row.gender ? row.gender : 'N/A'}</TableCell>
                            <TableCell>{calculateAge(row.date_of_birth)}</TableCell>
                            <TableCell>{row.department ? row.department : 'N/A'}</TableCell>
                            <TableCell>{row.job_title ? row.job_title : 'N/A'}</TableCell>
                            <TableCell>
                                {row.round_number ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme.palette.primary[200],
                                            minWidth: 60,
                                            minHeight: 20,
                                            borderRadius: 2,
                                            padding: 0.4
                                        }}
                                    >
                                        {row.round_number && (
                                            <Typography variant="subtitle1" color="primary">
                                                {row.round_number} <sup>{t(FormattedRound(row.round_number))} </sup>
                                            </Typography>
                                        )}{' '}
                                    </Box>
                                ) : (
                                    'N/A'
                                )}
                            </TableCell>
                            <TableCell>{row.pre_score ? row.pre_score + '%' : 'N/A'}</TableCell>
                            <TableCell>{row.post_score ? row.post_score + '%' : 'N/A'}</TableCell>
                            <TableCell>{row.created_at ? DateFormatter(row.created_at) : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

TraineesTable.propTypes = {
    rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

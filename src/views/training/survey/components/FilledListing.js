import * as React from 'react';
import { TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, useTheme, Box, Typography } from '@mui/material';
import { DateFormatter, FormattedRound } from 'utils/functions';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const columns = ['Survey', 'Session', 'Round', 'User name', 'Email', 'Filled on'];

export default function FilledSurveyTable({ rows }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="survey table">
                <TableHead sx={{ backgroundColor: theme.palette.primary[200] }}>
                    <TableRow>
                        {columns.map((item) => (
                            <TableCell>{t(item)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate('/training/survey/filled', { state: row })}
                        >
                            <TableCell component="th" scope="row">
                                <Typography variant="subtitle1">{row.title}</Typography>
                            </TableCell>
                            <TableCell>{row.round_name ? row.round_name : 'N/A'}</TableCell>
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
                                                {row.round_number} <sup>{FormattedRound(row.round_number)} </sup>
                                            </Typography>
                                        )}{' '}
                                    </Box>
                                ) : (
                                    'N/A'
                                )}
                            </TableCell>
                            <TableCell>{row.name ? row.name : 'N/A'}</TableCell>
                            <TableCell>{row.email ? row.email : 'N/A'}</TableCell>

                            <TableCell>{row.created_at ? DateFormatter(row.created_at) : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

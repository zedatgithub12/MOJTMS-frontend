import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    CircularProgress,
    Box
} from '@mui/material';
import { IconList } from '@tabler/icons';
import { FormatStatus } from 'utils/functions';

const TrainingSummaryTable = ({ isLoading, data }) => {
    return (
        <TableContainer component={Paper} sx={{ border: 0.6, borderColor: '#ddd', borderRadius: 4 }}>
            {isLoading ? (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                    <CircularProgress size={20} sx={{ m: 'auto' }} />
                </Box>
            ) : data.length === 0 ? (
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 200
                    }}
                >
                    <IconList size={40} stroke="1.2" />
                    <Typography variant="h4" mt={1.2}>
                        No Report This Month
                    </Typography>
                    <Typography variant="body2" mt={0.4}>
                        The report of training in between selected date appear here
                    </Typography>
                </Box>
            ) : (
                <Table>
                    <TableHead sx={{ backgroundColor: 'primary.200' }}>
                        <TableRow sx={{ color: 'white' }}>
                            <TableCell>
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Training Name
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Trainees
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Trainer
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Facilitator
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Surveyed
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Assessed
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    Status
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.session_name}</TableCell>
                                <TableCell align="center">{row.trainees_count}</TableCell>
                                <TableCell align="center">{row.trainer_count}</TableCell>
                                <TableCell align="center">{row.facilitator_count}</TableCell>
                                <TableCell align="center">{row.surveyed_count}</TableCell>
                                <TableCell align="center">{row.assessed_count}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={row.status}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontWeight: 'bold',
                                            color: FormatStatus(row?.status || ''),
                                            backgroundColor: FormatStatus(row?.status || '') + '08'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default TrainingSummaryTable;

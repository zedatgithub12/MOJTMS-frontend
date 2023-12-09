import * as React from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    useTheme,
    Typography,
    CircularProgress
} from '@mui/material';
import { DateFormatter, calculateAge } from 'utils/functions';
import { useNavigate } from 'react-router';

const columns = ['ID', 'Name', 'Email', 'Gender', 'Age', 'Address', 'Phone', 'Department', 'Joined on', 'Status'];

export default function TraineesTable({ rows, isLoading }) {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="trainees table">
                <TableHead sx={{ backgroundColor: theme.palette.primary[200] }}>
                    <TableRow>
                        {columns.map((item) => (
                            <TableCell sx={{ minWidth: 100 }}>{item}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {isLoading ? (
                    <TableBody>
                        <TableRow>
                            <TableCell align="center" colSpan={10}>
                                <CircularProgress size={20} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ) : (
                    <TableBody>
                        {' '}
                        {rows.map((row, index) => (
                            <TableRow key={index} sx={{ cursor: 'pointer' }} onClick={() => navigate('/trainee/details', { state: row })}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row.user">
                                    <Typography variant="subtitle1">{row.user.name}</Typography>
                                </TableCell>
                                <TableCell>{row.user.email ? row.user.email : 'N/A'}</TableCell>
                                <TableCell>{row.gender ? row.gender : 'N/A'}</TableCell>
                                <TableCell>{calculateAge(row.date_of_birth)}</TableCell>
                                <TableCell>{row.address ? row.address : 'N/A'}</TableCell>
                                <TableCell>{row.phone ? row.phone : 'N/A'}</TableCell>
                                <TableCell>{row.department ? row.department.name : 'N/A'}</TableCell>

                                <TableCell>{row.created_at ? DateFormatter(row.created_at) : 'N/A'}</TableCell>
                                <TableCell>{row.user ? row.user.status : 'N/A'}</TableCell>
                            </TableRow>
                        ))}{' '}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

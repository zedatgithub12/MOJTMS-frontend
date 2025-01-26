import { TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, useTheme } from '@mui/material';
import { calculateAge } from 'utils/functions';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const columns = ['Name', 'Email', 'Gender', 'Age', 'Job Title', 'Education Level'];

export default function TraineeTable({ rows }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: theme.palette.primary[200] }}>
                    <TableRow>
                        {columns.map((item, index) => (
                            <TableCell key={index}>{t(item)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index} sx={{ cursor: 'pointer' }} onClick={() => navigate('/trainee/details', { state: row })}>
                            <TableCell component="th" scope="row">
                                {row.user_name}
                            </TableCell>
                            <TableCell>{row.user_email ? row.user_email : 'N/A'}</TableCell>
                            <TableCell>{row.gender ? row.gender : 'N/A'}</TableCell>
                            <TableCell>{calculateAge(row.date_of_birth)}</TableCell>
                            <TableCell>{row.job_title ? row.job_title : 'N/A'}</TableCell>
                            <TableCell>{row.education_level ? row.education_level : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

TraineeTable.propTypes = {
    rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

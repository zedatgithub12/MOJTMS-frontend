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
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { useTranslation } from 'react-i18next';
import errorImage from 'assets/images/error.jpg';
import PropTypes from 'prop-types';

const columns = ['Roll', 'Name', 'Email', 'Gender', 'Age', 'Address', 'Phone', 'Department', 'Joined on', 'Status'];

function TraineesTable({ rows, isLoading, error }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const userStatusIndicator = (status) => {
        var text;
        var color;

        if (status == 'active') {
            text = 'Active';
            color = '#b9f6ca';
        } else if (status == 'pending') {
            text = 'Pending';
            color = '#CDD5DF';
        } else {
            text = 'Suspended';
            color = '#ffab91';
        }

        return { text, color };
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="trainees table">
                <TableHead sx={{ backgroundColor: theme.palette.primary[200] }}>
                    <TableRow>
                        {columns.map((item, index) => (
                            <TableCell key={index} sx={{ minWidth: 100 }}>
                                {t(item)}
                            </TableCell>
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
                ) : error ? (
                    <TableBody>
                        <TableRow>
                            <TableCell align="center" colSpan={10}>
                                <ErrorPrompt
                                    image={errorImage}
                                    title="Server Error"
                                    message="Oooops... There is server error fetching trainees"
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ) : rows.length === 0 ? (
                    <TableBody>
                        <TableRow>
                            <TableCell align="center" colSpan={10}>
                                <NoResult title="" message="Oooops... No trainee found" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ) : (
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ cursor: 'pointer', ':hover': { backgroundColor: theme.palette.secondary.light } }}
                                onClick={() => navigate('/trainee/details', { state: row })}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row.user.name">
                                    <Typography variant="subtitle1">{row.user.name}</Typography>
                                </TableCell>
                                <TableCell>{row.user.email ? row.user.email : 'N/A'}</TableCell>
                                <TableCell>{row.gender ? row.gender : 'N/A'}</TableCell>
                                <TableCell>{calculateAge(row.date_of_birth)}</TableCell>
                                <TableCell>{row.address ? row.address : 'N/A'}</TableCell>
                                <TableCell>{row.phone ? row.phone : 'N/A'}</TableCell>
                                <TableCell>{row.department ? row.department.name : 'N/A'}</TableCell>

                                <TableCell>{row.created_at ? DateFormatter(row.created_at) : 'N/A'}</TableCell>
                                <TableCell sx={{ backgroundColor: userStatusIndicator(row.user.status).color }}>
                                    {row.user ? userStatusIndicator(row.user.status).text : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}
TraineesTable.propTypes = {
    rows: PropTypes.array,
    isLoading: PropTypes.bool,
    error: PropTypes.object
};
export default TraineesTable;

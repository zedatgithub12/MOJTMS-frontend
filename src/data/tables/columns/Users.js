import { Box, Typography } from '@mui/material';
import { DateFormatter } from 'utils/functions';

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

export const UserColumn = [
    {
        headerName: 'Name',
        field: 'name',
        width: 200
    },
    {
        headerName: 'Email',
        field: 'email',
        width: 300
    },
    {
        headerName: 'Role',
        field: 'role',
        width: 120
    },
    {
        headerName: 'Added on',
        field: 'created_at',
        valueFormatter: (params) => {
            const formattedDate = DateFormatter(params.value);
            return formattedDate;
        },
        width: 180
    },
    {
        headerName: 'Status',
        field: 'status',
        renderCell: (params) => {
            const status = userStatusIndicator(params.value);

            return (
                <Box>
                    <Typography sx={{ backgroundColor: status.color, padding: 0.4, paddingX: 2.4, borderRadius: 4 }}>
                        {status.text}
                    </Typography>
                </Box>
            );
        },
        width: 120
    }
];

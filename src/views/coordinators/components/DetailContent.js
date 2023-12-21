import { Grid } from '@mui/material';
import { IconAddressBook, IconBuildingCommunity, IconCalendarStats, IconPhone, IconSchool, IconUser } from '@tabler/icons';
import PropTypes from 'prop-types';
import { IconLabel } from 'ui-component/content/IconLabel';
import { DateFormatter } from 'utils/functions';

const DetailContent = ({ data }) => {
    return (
        <Grid container>
            <Grid item xs={12} paddingY={1}>
                {data.department && (
                    <IconLabel content={data.department.name} label="Department">
                        <IconBuildingCommunity size={22} />
                    </IconLabel>
                )}

                {data.gender && (
                    <IconLabel content={data.gender} label="Gender">
                        <IconUser size={22} />
                    </IconLabel>
                )}

                {data.address && (
                    <IconLabel content={data.address} label="Address">
                        <IconAddressBook size={22} />
                    </IconLabel>
                )}

                {data.phone && (
                    <IconLabel content={data.phone} label="Phone">
                        <IconPhone size={22} />
                    </IconLabel>
                )}

                {data.education && (
                    <IconLabel content={data.education} label="Education level">
                        <IconSchool size={22} />
                    </IconLabel>
                )}

                {data.created_at && (
                    <IconLabel content={DateFormatter(data.created_at)} label="Joined on">
                        <IconCalendarStats size={22} />
                    </IconLabel>
                )}
            </Grid>
        </Grid>
    );
};

DetailContent.propTypes = {
    data: PropTypes.object
};

export default DetailContent;

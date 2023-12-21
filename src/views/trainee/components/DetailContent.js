import { Grid } from '@mui/material';
import {
    IconAddressBook,
    IconBriefcase,
    IconBuildingCommunity,
    IconCalendarStats,
    IconCalendarTime,
    IconChalkboard,
    IconPhone,
    IconSchool,
    IconUser
} from '@tabler/icons';
import PropTypes from 'prop-types';
import { IconLabel } from 'ui-component/content/IconLabel';
import { DateFormatter, calculateAge } from 'utils/functions';

const DetailContent = ({ data }) => {
    return (
        <Grid container>
            <Grid item xs={12} paddingY={1}>
                {data.department.name && (
                    <IconLabel content={data.department.name} label="Department">
                        <IconBuildingCommunity size={22} />
                    </IconLabel>
                )}

                {data.gender && (
                    <IconLabel content={data.gender} label="Gender">
                        <IconUser size={22} />
                    </IconLabel>
                )}

                {data.date_of_birth && (
                    <IconLabel content={calculateAge(data.date_of_birth)} label="Age">
                        <IconCalendarTime size={22} />
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

                {data.job_title && (
                    <IconLabel content={data.job_title} label="Position">
                        <IconBriefcase size={22} />
                    </IconLabel>
                )}

                {data.education_level && (
                    <IconLabel content={data.education_level} label="Education level">
                        <IconSchool size={22} />
                    </IconLabel>
                )}

                {data.training_took && (
                    <IconLabel content={data.training_took} label="Training Taken">
                        <IconChalkboard size={22} />
                    </IconLabel>
                )}

                {data.last_training_date && (
                    <IconLabel content={DateFormatter(data.last_training_date)} label="Last Training Date">
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

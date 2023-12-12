import * as React from 'react';
import { Box, Accordion, AccordionSummary, Typography, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DashboardAccordions = ({ categories, departments }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                marginX: 1.6,
                marginY: 1,
                paddingY: 1,
                border: 2,
                borderRadius: 2,
                borderColor: theme.palette.primary[200],
                cursor: 'pointer'
            }}
        >
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="departments-content" id="departments-header">
                    <Typography>Departments</Typography>
                </AccordionSummary>
                {departments}
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="category-content" id="category-header">
                    <Typography>Categories</Typography>
                </AccordionSummary>
                {categories}
            </Accordion>
        </Box>
    );
};

export default DashboardAccordions;

import React from 'react';
import { Box, Menu, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

export const FilterPanel = ({ open, anchorEl, filterButton, children, handleMenuClick, handleClose }) => {
    return (
        <React.Fragment>
            <Tooltip>
                <Box
                    onClick={handleMenuClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'filter-panel' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    {filterButton}
                </Box>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="filter-panel"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                {children}
            </Menu>
        </React.Fragment>
    );
};

FilterPanel.propTypes = {
    filterButton: PropTypes.node,
    children: PropTypes.node
};

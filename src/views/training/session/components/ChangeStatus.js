import * as React from 'react';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import PropTypes from 'prop-types';

function ChangeStatus({ options, onPress, selectedIndex, isUpdating }) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ButtonGroup variant="text" ref={anchorRef} aria-label="split button">
                <Button onClick={handleToggle}>
                    {t(options[selectedIndex])}
                    {isUpdating ? <CircularProgress size={14} sx={{ marginX: 1 }} /> : <ArrowDropDownIcon fontSize="small" />}
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(event) => onPress(event, index)}
                                            sx={{ textTransform: 'capitalize' }}
                                        >
                                            {t(option)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}

ChangeStatus.propTypes = {
    options: PropTypes.array,
    onPress: PropTypes.func,
    selectedIndex: PropTypes.number,
    isUpdating: PropTypes.bool
};

export default ChangeStatus;

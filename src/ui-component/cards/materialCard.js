import React, { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Divider, IconButton, ListItemIcon, MenuItem, useTheme } from '@mui/material';
import { IconArchive, IconArchiveOff, IconDownload, IconEdit, IconPaperclip } from '@tabler/icons';
import FileTypes from 'data/static/fileTypes';
import { MaterialMenu } from 'ui-component/menu/material';

const MaterialCard = forwardRef(({ material, sx = {}, onUpdate, onArchive, onUnarchive, onDownload }, ref) => {
    const theme = useTheme();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const getFileTypeIcon = (fileTypeName) => {
        const fileType = FileTypes.find((fileType) => fileType.name === fileTypeName);

        if (fileType) {
            return fileType.icon;
        } else {
            return <IconPaperclip size={24} />;
        }
    };

    return (
        <React.Fragment>
            {material ? (
                <Card
                    ref={ref}
                    sx={{
                        border: '1px solid',
                        marginTop: 2,
                        borderColor: theme.palette.secondary.light,
                        ':hover': {
                            boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                        },
                        ...sx
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 2
                            }}
                        >
                            {material.title && <Typography variant="subtitle1">{material.title}</Typography>}

                            {role === 'Admin' ? (
                                <MaterialMenu
                                    children={
                                        <Box>
                                            <MenuItem onClick={onUpdate}>
                                                <ListItemIcon>
                                                    <IconEdit size={18} />
                                                </ListItemIcon>
                                                Update
                                            </MenuItem>

                                            <Divider />
                                            {material.status === 'archived' ? (
                                                <MenuItem onClick={onArchive}>
                                                    <ListItemIcon>
                                                        <IconArchiveOff size={18} />
                                                    </ListItemIcon>
                                                    Un Archive
                                                </MenuItem>
                                            ) : (
                                                <MenuItem onClick={onUnarchive}>
                                                    <ListItemIcon>
                                                        <IconArchive size={18} />
                                                    </ListItemIcon>
                                                    Archive
                                                </MenuItem>
                                            )}
                                        </Box>
                                    }
                                />
                            ) : role === 'Coordinator' ? (
                                <MaterialMenu
                                    children={
                                        <Box>
                                            <MenuItem onClick={onUpdate}>
                                                <ListItemIcon>
                                                    <IconEdit size={18} />
                                                </ListItemIcon>
                                                Update
                                            </MenuItem>

                                            <Divider />
                                            {material.status === 'archived' ? (
                                                <MenuItem onClick={onArchive}>
                                                    <ListItemIcon>
                                                        <IconArchiveOff size={18} />
                                                    </ListItemIcon>
                                                    Un Archive
                                                </MenuItem>
                                            ) : (
                                                <MenuItem onClick={onUnarchive}>
                                                    <ListItemIcon>
                                                        <IconArchive size={18} />
                                                    </ListItemIcon>
                                                    Archive
                                                </MenuItem>
                                            )}
                                        </Box>
                                    }
                                />
                            ) : null}
                        </Box>

                        {material.description && (
                            <Typography variant="body2" sx={{ paddingRight: 4, marginY: 1 }}>
                                {material.description}
                            </Typography>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: theme.palette.grey[50],
                                borderRadius: 2,
                                border: 1,
                                borderColor: theme.palette.primary[200],
                                padding: 2
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                {material.file_type && (
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 2,
                                            backgroundColor: theme.palette.primary[200],
                                            borderRadius: 30,
                                            marginRight: 4
                                        }}
                                    >
                                        {getFileTypeIcon(material.file_type)}
                                    </Box>
                                )}

                                <Box>
                                    {material.file && <Typography variant="h5">{material.file}</Typography>}
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingY: 1 }}>
                                        {material.file_type && <Typography variant="body2">{material.file_type} </Typography>}
                                        {material.file_size && (
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{ color: theme.palette.primary.main, marginX: 2 }}
                                            />
                                        )}
                                        {material.file_size && <Typography variant="body2">{material.file_size} </Typography>}
                                    </Box>
                                </Box>
                            </Box>
                            <IconButton onClick={onDownload}>
                                <IconDownload size={20} />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <CircularProgress size={24} />
            )}
        </React.Fragment>
    );
});

MaterialCard.propTypes = {
    sx: PropTypes.object,
    material: PropTypes.object,
    onUpdate: PropTypes.func,
    onArchive: PropTypes.func,
    onUnarchive: PropTypes.func,
    onDownload: PropTypes.func
};

export default MaterialCard;

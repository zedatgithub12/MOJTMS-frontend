import { IconHeadset, IconPaperclip, IconPhoto, IconPlus, IconVideo } from '@tabler/icons';

const FileTypes = [
    {
        id: 1,
        name: 'upload',
        icon: <IconPlus size={24} />
    },
    {
        id: 2,
        name: 'application',
        icon: <IconPaperclip size={24} />
    },
    {
        id: 3,
        name: 'video',
        icon: <IconVideo size={24} />
    },
    {
        id: 4,
        name: 'audio',
        icon: <IconHeadset size={24} />
    },
    {
        id: 5,
        name: 'image',
        icon: <IconPhoto size={24} />
    }
];

export default FileTypes;

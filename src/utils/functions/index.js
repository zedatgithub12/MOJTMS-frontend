export const ReadMore = (content, initial, max, collapse) => {
    var text;
    let textLength = content.length;
    if (textLength > max && collapse) {
        text = content.slice(initial, max) + ' ...';
    } else if (!collapse) {
        text = content;
    } else {
        text = content.slice(initial, max);
    }

    return text;
};

export const DateFormatter = (dates) => {
    var year = dates.slice(0, 4);
    var month = dates.slice(5, 7);
    var day = dates.slice(8, 10);
    const date = day + '-' + month + '-' + year;
    return date;
};

export const convertToMB = (sizeInBytes) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    let selectedUnit = 0;

    while (sizeInBytes >= 1024 && selectedUnit < units.length - 1) {
        sizeInBytes /= 1024;
        selectedUnit++;
    }

    return `${sizeInBytes.toFixed(2)} ${units[selectedUnit]}`;
};

export const validateImage = (file, size) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = size * 1024 * 1024; // size in MB

    if (!validTypes.includes(file.type)) {
        return {
            type: false,
            message: `The uploaded file type should be JPEG, JPG, or PNG. The uploaded file type is ${file.type}`,
            size: false
        };
    }

    if (file.size > maxSizeInBytes) {
        return {
            type: true,
            size: false,
            message: `The uploaded image size exceed the max image size of ${size}`
        };
    }

    return {
        type: true,
        size: true,
        message: ''
    };
};

export const ProfileValidator = (file, size) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = size * 1024 * 1024; // size in MB

    if (!validTypes.includes(file.type)) {
        return {
            type: false,
            message: `The profile should be JPEG, JPG, or PNG file`,
            size: false
        };
    }

    if (file.size > maxSizeInBytes) {
        return {
            type: true,
            size: false,
            message: `The uploaded image size exceed the max image size of ${size}`
        };
    }

    return {
        type: true,
        size: true,
        message: ''
    };
};

export const TimeFormatter = (number) => {
    if (number === 0) {
        return '0 min';
    } else if (number < 0) {
        return 'Invalid time';
    } else if (number === 60) {
        return '1 hour';
    } else if (number > 60) {
        const hours = Math.floor(number / 60);
        const minutes = number % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')} min`;
    } else {
        return `${number} min`;
    }
};

//format date and time then return it in the nov,30,2023 | 10:00am
export const formatDate = (inputDate) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return `${formattedDate} | ${formattedTime}`;
};

//format date only and return it in the nov,30,2023
export const formatDateOnly = (inputDate) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
};
//round count formatter
export const FormattedRound = (number) => {
    var count;

    switch (number) {
        case 1:
            count = 'st';
            break;
        case 2:
            count = 'nd';
            break;
        case 3:
            count = 'rd';
            break;
        default:
            count = 'th';
            break;
    }
    return count;
};

export const FormatStatus = (statusInput) => {
    var statusColor;

    switch (statusInput) {
        case 'draft':
            statusColor = '#808080';
            break;
        case 'upcoming':
            statusColor = '#007bff';
            break;
        case 'scheduled':
            statusColor = '#656666';
            break;
        case 'inprogress':
            statusColor = '#21a300';
            break;
        case 'cancelled':
            statusColor = '#c20013';
            break;
        default:
            statusColor = '#1a1a1a';
            break;
    }
    return statusColor;
};

export const convertDateTime = (datetime) => {
    const date = new Date(datetime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';

    const convertedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
    return convertedTime;
};

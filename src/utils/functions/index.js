import EtDate from '../ethiopian-date';

const etTime = {
    0: 12,
    1: 7,
    2: 8,
    3: 9,
    4: 10,
    5: 11,
    6: 12,
    7: 1,
    8: 2,
    9: 3,
    10: 4,
    11: 5,
    12: 6,
    13: 7,
    14: 8,
    15: 9,
    16: 10,
    17: 11,
    18: 12,
    19: 1,
    20: 2,
    21: 3,
    22: 4,
    23: 5
};

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
    const isAmharic = localStorage.getItem('lang');

    if (isAmharic === 'am') {
        const ethioDate = EtDate(dates);
        return ethioDate;
    } else {
        var year = dates.slice(0, 4);
        var month = dates.slice(5, 7);
        var day = dates.slice(8, 10);
        const formattedDate = day + '-' + month + '-' + year;
        return formattedDate;
    }
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
    const isAmharic = localStorage.getItem('lang');

    if (isAmharic === 'am') {
        const ethioDate = EtDate(inputDate);

        const date = new Date(inputDate);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = 'ሰዓት';

        if (hours >= 7 && hours <= 18) {
            const convertedTime = `${etTime[hours]}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
            return `${ethioDate} | ${convertedTime}`;
        }
    } else {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return `${formattedDate} | ${formattedTime}`;
    }
};

//format date only and return it in the nov,30,2023
export const formatDateOnly = (inputDate) => {
    const isAmharic = localStorage.getItem('lang');

    if (isAmharic === 'am') {
        const ethioDate = EtDate(inputDate);
        return ethioDate;
    } else {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(inputDate);
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    }
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
    const isAmharic = localStorage.getItem('lang');

    if (isAmharic === 'am') {
        const date = new Date(datetime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = 'ሰዓት';

        if (hours >= 7 && hours <= 18) {
            return `${etTime[hours]}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
        }
    } else {
        const date = new Date(datetime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'pm' : 'am';

        const convertedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
        return convertedTime;
    }
};

export function calculateAge(dateString) {
    if (dateString === null) {
        return 'N/A';
    }

    var birthDate = new Date(dateString);
    var today = new Date();

    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    var dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

export function isDateGreaterOrEqualToday(dateString) {
    // Create Date objects for the passed date string and today
    const givenDate = new Date(dateString);
    const today = new Date();

    // Set the time parts to zero for accurate comparison
    givenDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Compare the dates and return the boolean result
    return givenDate <= today;
}

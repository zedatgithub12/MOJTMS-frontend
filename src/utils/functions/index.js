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

// export const DateFormatter = (dates) => {
//     var year = dates.slice(0, 4);
//     var month = dates.slice(5, 7);
//     var day = dates.slice(8, 10);
//     const date = day + '-' + month + '-' + year;
//     return date;
// };

// export const DateFormatter = (dates) => {
//     const language = navigator.language || navigator.userLanguage;
//     const isAmharic = localStorage.getItem('lang');

//     if (isAmharic === 'am') {
//         const ethioDate = convertToEthiopianDate(dates);
//         return ethioDate;
//     } else {
//         var year = dates.slice(0, 4);
//         var month = dates.slice(5, 7);
//         var day = dates.slice(8, 10);
//         const formattedDate = day + '-' + month + '-' + year;
//         return formattedDate;
//     }
// };

// const convertToEthiopianDate = (gregorianDate) => {
//     const gregorianYear = parseInt(gregorianDate.slice(0, 4));
//     const gregorianMonth = parseInt(gregorianDate.slice(5, 7));
//     const gregorianDay = parseInt(gregorianDate.slice(8, 10));

//     const ethiopianYear = gregorianYear - 8;
//     const ethiopianMonth = gregorianMonth - 2 <= 0 ? gregorianMonth + 10 : gregorianMonth - 2;
//     const ethiopianDay = gregorianDay - 10;

//     return `${ethiopianYear}-${ethiopianMonth < 10 ? '0' + ethiopianMonth : ethiopianMonth}-${
//         ethiopianDay < 10 ? '0' + ethiopianDay : ethiopianDay
//     }`;
// };

export const DateFormatter = (dates) => {
    const isAmharic = localStorage.getItem('lang');

    if (isAmharic === 'am') {
        const ethioDate = convertToEthiopianDate(dates);
        return ethioDate;
    } else {
        var year = dates.slice(0, 4);
        var month = dates.slice(5, 7);
        var day = dates.slice(8, 10);
        const formattedDate = day + '-' + month + '-' + year;
        return formattedDate;
    }
};

const gregorianToEthiopianYear = (gregorianYear, gregorianMonth, gregorianDay) => {
    const ethioYear = gregorianYear - 8;

    if ((gregorianMonth === 9 && gregorianDay >= 11) || gregorianMonth > 9) {
        return ethioYear + 1;
    }

    return ethioYear;
};

const gregorianToEthiopianMonth = (gregorianMonth, ethioYear) => {
    const ethioYearChangeMonth = isLeapYear(ethioYear) ? 12 : 11;
    const ethioMonth = (gregorianMonth + ethioYearChangeMonth) % 13;

    return ethioMonth === 0 ? 13 : ethioMonth;
};

const gregorianToEthiopianDay = (gregorianDay, gregorianMonth, isLeapYear) => {
    const dayMapping = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let ethioDay = gregorianDay - 10;
    const monthDays = dayMapping[gregorianMonth];

    if (gregorianMonth === 2 && isLeapYear) {
        ethioDay++;
    }

    if (ethioDay <= 0) {
        gregorianMonth--;
        if (gregorianMonth === 0) {
            gregorianMonth = 12;
        }
        ethioDay += dayMapping[gregorianMonth];
    }

    return ethioDay;
};

const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const convertToEthiopianDate = (gregorianDate) => {
    // const day = parseInt(gregorianDate.slice(0, 2));
    // const month = parseInt(gregorianDate.slice(3, 5));
    // const year = parseInt(gregorianDate.slice(6, 10));
    var year = gregorianDate.slice(0, 4);
    var month = gregorianDate.slice(5, 7);
    var day = gregorianDate.slice(8, 10);

    const ethioYear = gregorianToEthiopianYear(year, month, day);
    const ethioMonth = gregorianToEthiopianMonth(month);
    const ethioDay = gregorianToEthiopianDay(day, month, isLeapYear(year));

    return `${ethioDay < 10 ? '0' + ethioDay : ethioDay}-${ethioMonth < 10 ? '0' + ethioMonth : ethioMonth}-${ethioYear}`;
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

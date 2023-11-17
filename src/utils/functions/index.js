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

export const TimeFormatter = (number) => {
    if (number === 0) {
        return '0 m';
    } else if (number < 0) {
        return 'Invalid time';
    } else if (number === 60) {
        return '1 hour';
    } else if (number > 60) {
        const hours = Math.floor(number / 60);
        const minutes = number % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')} m`;
    } else {
        return `${number} m`;
    }
};

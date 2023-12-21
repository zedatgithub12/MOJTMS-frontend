import { sizes } from 'constants';

export function validateFile(file) {
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const allowedDocumentTypes = ['application/msword', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint'];
    const allowedVideoTypes = ['video/mp4'];
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/opus', 'audio/mp4'];

    const maxFileSize = {
        'image/png': 5,
        'image/jpeg': 5,
        'image/jpg': 5,
        'application/msword': 10,
        'application/pdf': 10,
        'application/vnd.ms-excel': 10,
        'application/vnd.ms-powerpoint': 10,
        'video/mp4': 50,
        'audio/mpeg': 10,
        'audio/mp3': 10,
        'audio/ogg': 10,
        'audio/opus': 10,
        'audio/mo4': 10
    };

    if (allowedImageTypes.includes(file.type)) {
        return validateImage(file, maxFileSize[file.type]);
    } else if (allowedDocumentTypes.includes(file.type)) {
        return validateDocument(file, maxFileSize[file.type]);
    } else if (allowedVideoTypes.includes(file.type)) {
        return validateVideo(file, maxFileSize[file.type]);
    } else if (allowedAudioTypes.includes(file.type)) {
        return validateAudio(file, maxFileSize[file.type]);
    } else {
        return { status: false, message: 'Invalid file type. Please upload a valid file.' };
    }
}

export function validateImage(file, maxSize) {
    if (file.size > maxSize * 1024 * 1024) {
        return { status: false, message: `File size exceeds the maximum limit of ${maxSize}MB.` };
    }

    // Additional validation logic for image files
    // ...

    return { status: true, message: '' };
}

export function validateDocument(file, maxSize) {
    if (file.size > maxSize * 1024 * 1024) {
        return { status: false, message: `File size exceeds the maximum limit of ${maxSize}MB.` };
    }

    // Additional validation logic for document files
    // ...

    return { status: true, message: '' };
}

export function validateVideo(file, maxSize) {
    if (file.size > maxSize * 1024 * 1024) {
        return { status: false, message: `File size exceeds the maximum limit of ${maxSize}MB.` };
    }

    // Additional validation logic for video files
    // ...

    return { status: true, message: '' };
}

export function validateAudio(file, maxSize) {
    if (file.size > maxSize * 1024 * 1024) {
        return { status: false, message: `File size exceeds the maximum limit of ${maxSize}MB.` };
    }

    // Additional validation logic for audio files
    // ...

    return { status: true, message: '' };
}

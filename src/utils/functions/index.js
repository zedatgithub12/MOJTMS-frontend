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

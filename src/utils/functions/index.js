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

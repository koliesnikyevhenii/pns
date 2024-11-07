export const removeSpacesFromObjectKeys = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = key.replace(/\s+/g, '');
        acc[newKey] = obj[key];
        return acc;
    }, {});
};

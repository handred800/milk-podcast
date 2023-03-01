export const mentionParser = (inputString) => {
    if (inputString === '') return [];
    const regexp = /《(.*?)》/g;
    const result = inputString.match(regexp);
    return result ? result.map((name) => name.substring(1, name.length - 1)) : [];
}


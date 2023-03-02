export const mentionParser = (inputString) => {
    if (inputString === '') return [];
    const regexp = /《(.*?)》/g;
    const result = inputString.match(regexp);
    return result ? result.map((name) => name.substring(1, name.length - 1)) : [];
}

export const csvFormatter = (csvArrary) => {
    const head = csvArrary[0]
    const body = csvArrary.slice(1);
    return body.map((item) => {
        let obj = {};
        for (let i = 0; i < head.length; i++) {
            obj[head[i]] = item[i] || '';
        }
        return obj;
    })
}
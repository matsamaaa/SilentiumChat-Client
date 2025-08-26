const isSameKey = (key1, key2) => {
    if (!key1 || !key2) return false;
    return key1 === key2;
}

export { isSameKey };
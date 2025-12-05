const isSameKey = (key1, key2) => {
    if (!key1 || !key2) return false;
    return key1 === key2;
}

const isSamePassword = (password1, password2) => {
    if (!password1 || !password2) return false;
    return String(password1).toLowerCase() === String(password2).toLowerCase();
}

export { isSameKey, isSamePassword };
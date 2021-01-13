
export const phoneFormatted = (phone) => {

    if (phone.includes('-')) {
        return phone;
    }
    const t = phone.slice(0, 3)
    const e = phone.slice(3, 6)
    const l = phone.slice(6, 10)
    return t + '-' + e + "-" + l

}





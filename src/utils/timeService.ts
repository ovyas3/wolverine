export const getEpoch = (date:Date) => {
    return Math.floor(date.getTime() / 1000)
}
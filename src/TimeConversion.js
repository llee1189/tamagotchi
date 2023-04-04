export function msToSeconds(s) {
    return Math.floor(s / 1000)
}

export function msToMinute(s) {
    return Math.floor(msToSeconds(s) / 60)
}

export function msToHours(s) {
    return Math.floor(msToMinute(s) / 60) 
}

export function msToDays(s) {
    return Math.floor(msToHours(s) / 24)
}

export function secondsToMs(s) {
    return Math.floor(s * 1000) 
}

export function minutesToMs(s) {
    return Math.floor(secondsToMs(s) * 60)
}

export function hoursToMs(s) {
    return Math.floor(minutesToMs(s) * 60 )
}

export function daysToMs(s) {
    return Math.floor(hoursToMs(s) * 24)
}
export interface FormattedDate {
    yyyymmdd: string
    month: string
    day: string
    weekday: string
}

const getDatePartsInTimeZone = (date: Date, timeZone: string) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date)

    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
    return {
        year: values.year,
        month: values.month,
        day: values.day,
    }
}

export const formatDate = (date: Date, timeZone = 'Asia/Seoul'): FormattedDate => {
    const { year, month, day } = getDatePartsInTimeZone(date, timeZone)

    const weekday = new Intl.DateTimeFormat('ko-KR', {
        timeZone,
        weekday: 'long',
    }).format(date)

    return {
        yyyymmdd: `${year}${month}${day}`,
        month,
        day,
        weekday,
    }
}

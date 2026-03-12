export interface FormattedDate {
    yyyymmdd: string
    month: string
    day: string
    weekday: string
}

export const formatDate = (date: Date): FormattedDate => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const weekday = new Intl.DateTimeFormat('ko-KR', {
        weekday: 'long',
    }).format(date)

    return {
        yyyymmdd: `${year}${month}${day}`,
        month,
        day,
        weekday,
    }
}

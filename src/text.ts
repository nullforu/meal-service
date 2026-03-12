const replaceMap: Record<string, string> = {
    '<br/>': '\n',
}

export const replaceInfo = (text: string): string => {
    let result = text
    for (const [key, value] of Object.entries(replaceMap)) {
        result = result.split(key).join(value)
    }
    return result.trim()
}

export const cleanMenu = (text: string): string => {
    return text.replace(/\s*\(?\s*\d+(?:\s*\.\s*\d+)*\s*\)?/g, '').trim()
}

import { NEIS_BASE_URL, NEIS_KEY, NEIS_OUTPUT_TYPE, NEIS_ATPT_CODE, NEIS_SCHOOL_CODE } from './config.js'
import { cleanMenu, replaceInfo } from './text.js'

export interface MealInfo {
    menu: string
    mealName: string
    calories: string
    nutrition: string
}

interface NeisMealRow {
    DDISH_NM?: string
    MMEAL_SC_NM?: string
    CAL_INFO?: string
    NTR_INFO?: string
}

interface NeisMealServiceDietInfo {
    row: NeisMealRow[]
}

interface NeisResponse {
    mealServiceDietInfo?: [unknown, NeisMealServiceDietInfo]
}

export const getMealInfo = async (dateString: string): Promise<MealInfo | null> => {
    const params = new URLSearchParams({
        KEY: NEIS_KEY,
        Type: NEIS_OUTPUT_TYPE,
        ATPT_OFCDC_SC_CODE: NEIS_ATPT_CODE,
        SD_SCHUL_CODE: NEIS_SCHOOL_CODE,
        MLSV_YMD: dateString,
    })

    const url = `${NEIS_BASE_URL}?${params.toString()}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            console.error('급식 API 응답 오류:', response.status, response.statusText)
            return null
        }
        const data = (await response.json()) as NeisResponse

        console.log(data.mealServiceDietInfo)
        if (data.mealServiceDietInfo) {
            const row = data.mealServiceDietInfo[1]?.row?.[0]
            if (!row) {
                console.warn('급식 데이터가 비어있습니다.')
                return null
            }
            const meal = replaceInfo(row.DDISH_NM || '급식 정보 없음')
            const mealName = replaceInfo(row.MMEAL_SC_NM || '식사 정보 없음')
            const calories = replaceInfo(row.CAL_INFO || '칼로리 정보 없음')
            const nutrition = replaceInfo(row.NTR_INFO || '영양 정보 없음')

            return {
                menu: cleanMenu(meal),
                mealName,
                calories,
                nutrition,
            }
        }
        return null
    } catch (error) {
        console.error('급식 정보를 가져오는 중에 오류가 발생했습니다:', error)
        return null
    }
}

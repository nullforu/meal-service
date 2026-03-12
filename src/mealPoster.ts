import { formatDate } from './date.js'
import { getMealInfo } from './neisClient.js'
import { commentToBand, postToBand } from './bandClient.js'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const INFO_COMMENT = `※ 급식봇이 다시 부활했습니다!
        
전 급식봇은 운영이 중단되었고, 2~3년전 졸업하신 선배님께 연락드릴 방법이 마땅치 않아 새롭게 작성하였습니다.

개학과 동시에 운영하려고 했으나, 네이버 밴드 API 정책 변경으로 한동안 서비스 발급이 어려웠습니다.

3주간의 발급 시도와 개발자 센터 건의 끝에 발급되어 금일부터 평일 오전 6시 30분에 급식 정보가 작성됩니다.

Source code: https://github.com/nullforu/meal-service
`

export const sendMealInfoToBand = async (): Promise<void> => {
    const today = new Date()
    const { yyyymmdd, month, day, weekday } = formatDate(today, 'Asia/Seoul')

    const mealInfo = await getMealInfo(yyyymmdd)
    if (!mealInfo) {
        console.log('급식이 없는 날입니다. 스킵함.')
        return
    }

    const message = `<b>[${month}월 ${day}일 ${weekday} ${mealInfo.mealName}]</b>\n\n${mealInfo.menu}\n\n총 열량: ${mealInfo.calories}`
    const postResponse = await postToBand(message)

    if (postResponse && postResponse.result_code === 1) {
        const bandKey = postResponse.result_data.band_key
        const postId = postResponse.result_data.post_key

        const comment = `[영양 정보]\n\n${mealInfo.nutrition}\n\n(급식 정보는 교육청에서 제공하는 데이터를 기반으로 합니다.)`
        await commentToBand(comment, bandKey, postId)

        // await sleep(10000)

        // await commentToBand(INFO_COMMENT, bandKey, postId)
    }
}

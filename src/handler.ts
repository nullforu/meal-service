import { sendMealInfoToBand } from './mealPoster.js'

export interface LambdaResponse {
    statusCode: number
    body: string
}

export const handler = async (event: unknown): Promise<LambdaResponse> => {
    await sendMealInfoToBand()
    return {
        statusCode: 200,
        body: '급식 정보가 밴드에 성공적으로 전송되었습니다.',
    }
}

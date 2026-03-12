import { BAND_ACCESS_TOKEN, BAND_KEY } from './config.js'

const BAND_POST_URL = 'https://openapi.band.us/v2.2/band/post/create'
const BAND_COMMENT_URL = 'https://openapi.band.us/v2/band/post/comment/create'

export interface BandPostResponse {
    result_code: number
    result_data: {
        band_key: string
        post_key: string
    }
}

export interface BandCommentResponse {
    result_code: number
    result_data: {
        message: string
    }
}

const requestBand = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${BAND_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    if (response.ok) {
        return (await response.json()) as T
    }

    throw new Error(`HTTP ${response.status} ${response.statusText}`)
}

export const postToBand = async (message: string): Promise<BandPostResponse | null> => {
    try {
        const url = `${BAND_POST_URL}?band_key=${BAND_KEY}&content=${encodeURIComponent(message)}&do_push=true`
        const responseData = await requestBand<BandPostResponse>(url)
        if (responseData.result_code !== 1) {
            console.error('메시지 전송 실패 (result_code):', responseData)
            return null
        }
        console.log('메시지 전송 성공:', responseData)
        return responseData
    } catch (error) {
        console.error('메시지 전송 실패:', error)
    }

    return null
}

export const commentToBand = async (comment: string, bandKey: string, postId: string): Promise<BandCommentResponse | null> => {
    try {
        const url = `${BAND_COMMENT_URL}?band_key=${bandKey}&post_key=${postId}&body=${encodeURIComponent(comment)}`
        const responseData = await requestBand<BandCommentResponse>(url)
        if (responseData.result_code !== 1) {
            console.error('댓글 전송 실패 (result_code):', responseData)
            return null
        }
        console.log('댓글 전송 성공:', responseData)
        return responseData
    } catch (error) {
        console.error('댓글 전송 실패:', error)
    }

    return null
}

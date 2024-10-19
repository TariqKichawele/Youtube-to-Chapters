'use server';

import { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { VideoDetails, SubtitlesResponse } from "@/lib/types";

export async function getVideoId(link: string): Promise<string | null> {
    const videoIdPattern = /[?&]v=([^&]+)/;
    const match = link.match(videoIdPattern);
    return match ? match[1] : null;
}

export async function fetchFromYoutubeApi<T>(endpoint: string, params: Record<string, string>): Promise<T | null> {
    try {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `https://yt-api.p.rapidapi.com/${endpoint}`,
            params: {
                id: params.videoId
            },
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": 'yt-api.p.rapidapi.com'
            }
        }

        const res: AxiosResponse<T> = await axios.request(options);

        if(res.status !== 200 || !res.data) {
            console.error('Failed to fetch data from YouTube API', res.status, res.data);
            return null;
        }

        return res.data
    } catch (error) {
        console.error("failed to fetch from youtube api", error);
        return null;
    }
}

export async function getVideoDetails(videoId: string) {
    if(!videoId) {
        throw new Error("Video ID is required");
    }

    return fetchFromYoutubeApi<VideoDetails>("video/info", { videoId });
}

export async function getVideoTranscript(videoId: string): Promise<SubtitlesResponse | null> {
    if(!videoId) {
        throw new Error("Video ID is required");
    }

    return fetchFromYoutubeApi<SubtitlesResponse>("subtitles", { videoId });
}


'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { validateYoutubeUrl } from "@/utils/validation";
import { getVideoDetails, getVideoId, getVideoTranscript } from "@/utils/youtube";
import { parseXMLContent } from "@/utils/parsing";
import { generateChaptersWithAI } from "@/utils/openai";

type GenerateChaptersResponse = {
    success: boolean;
    error?: string;
    data?: any;
}

export async function generateChapters(formData: FormData): Promise<GenerateChaptersResponse> {
    const session = await getServerSession(authOptions);
    if(!session?.user?.email) {
        return { success: false, error: "Authentication required" }
    }

    const link = formData.get("link") as string;
    if(!link) {
        return { success: false, error: "Link is required" }
    }

    if(!await validateYoutubeUrl(link)) {
        return { success: false, error: "Invalid link" }
    }

    const videoId = await getVideoId(link);
    if(!videoId) {
        return { success: false, error: "Failed to get video ID" }
    }

    const videoDetails = await getVideoDetails(videoId);
    const videoTranscript = await getVideoTranscript(videoId);
    
    if(!videoDetails || !videoTranscript?.subtitles || videoTranscript.subtitles.length === 0) {
        return { success: false, error: "Failed to get video details" }
    }

    const lengthSeconds = 
        typeof videoDetails.lengthSeconds === "string" 
        ? parseInt(videoDetails.lengthSeconds, 10) 
        : videoDetails.lengthSeconds;

    if(isNaN(lengthSeconds)) {
        return { success: false, error: "Failed to get video length" }
    }

    if(lengthSeconds > 3600) {
        return { success: false, error: "Video length is too long" }
    }

    const parsedTranscript = await parseXMLContent(videoTranscript.subtitles[0]);
    if(!parsedTranscript) { 
        return { success: false, error: "Failed to parse transcript" }
    }

    const openAIChapters = await generateChaptersWithAI(parsedTranscript, lengthSeconds);
    if(!openAIChapters) {
        return { success: false, error: "Failed to generate chapters" }
    }

    




}


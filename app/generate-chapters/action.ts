'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { validateYoutubeUrl } from "@/utils/validation";

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


}
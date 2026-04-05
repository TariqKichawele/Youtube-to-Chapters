'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteChapterSet(
    chapterSetId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return { success: false, error: 'Authentication required' }
        }

        const user = await prisma.user.findFirst({
            where: { email: session.user.email },
            select: { id: true },
        })
        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const result = await prisma.chapterSet.deleteMany({
            where: { id: chapterSetId, userId: user.id },
        })

        if (result.count === 0) {
            return { success: false, error: 'Generation not found or already removed' }
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('deleteChapterSet failed', error)
        const message =
            error instanceof Error ? error.message : String(error)
        return { success: false, error: message }
    }
}

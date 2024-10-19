import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import ChaptersWrapper from '@/components/ChaptersWrapper';

const Dashboard = async() => {
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email) {
        return redirect('/signin');
    }

    const subscribed = null;

    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        },
        select: {
            savedChapters: true,
        }
    });

    const isEligible = false;
    const message = 'Hello';
  return (
    <MaxWidthWrapper>
        <div className="flex flex-col gap-4 mt-12">
            <div className="flex flex-row justify-between items-center">
                <Header text={`👋 Hello, ${session?.user?.name || "User"}`} />
                {subscribed && (
                    <Link
                        href={'/'}
                        className={buttonVariants({
                            variant: "outline",
                            className: "w-48",
                        })}
                    >
                        Manage subscription
                    </Link>
                )}
                {!subscribed && (
                    <Link
                        href={'/'}
                        className={buttonVariants({
                            variant: "default",
                            className: "w-48",
                        })}
                    >
                        Upgrade to premium
                    </Link>
                )}
            </div>
            {isEligible && message}
            {!isEligible && message}
        </div>
        <ChaptersWrapper 
            user={user && { savedChapters: user.savedChapters }}
        />
    </MaxWidthWrapper>
  )
}

export default Dashboard
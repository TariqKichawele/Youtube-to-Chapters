import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PageContent from './pagecontent';


const GenerateChapters = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/signin");
    }
    return <PageContent />;
}

export default GenerateChapters
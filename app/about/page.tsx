import Header from '@/components/Header'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import Image from 'next/image'
import { Linkedin } from 'lucide-react'

const About = () => {
  return (
    <MaxWidthWrapper className="flex flex-col gap-8 py-12 min-h-screen">
    <Header text="About YouTubeToChapters" />
    <div className="grid md:grid-cols-2 gap-8 items-center w-full">
      <div className="space-y-6">
        <p className="text-xl text-muted-foreground leading-relaxed">
          YouTubeToChapters is a YouTube video to chapter converter that uses
          AI to generate chapters from YouTube videos.
        </p>
        <div className="bg-secondary p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">How it works</h2>
          <ul className="list-disc list-inside mb-2">
            <li>Automatic chapter generation for YouTube videos</li>
            <li>Easy to use</li>
            <li>No need to manually create chapters</li>
          </ul>
        </div>
      </div>
      <Image
        src="https://res.cloudinary.com/damqrrryq/image/upload/v1727349411/pexels-divinetechygirl-1181244_tlg3ic.jpg"
        alt="YouTubeToChapters"
        width={500}
        height={500}
        className="rounded-lg shadow-lg"
      />
    </div>
    <div className="bg-primary/5 p-6 rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          About Tariq Kichawele
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          I&apos;m a full-stack developer based in Raleigh, NC. I build web and mobile
          applications with clean code and strong user experiences. I graduated from UNC
          Charlotte with a B.S. in Public Health, then moved into tech—starting as a
          backend developer at Revature (Java, Spring Boot, PostgreSQL) and later
          working at Scale AI on AI-generated code evaluation and training data. More
          about my background, stack, and projects is on{' '}
          <a
            href="https://tariqk.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium underline underline-offset-4 hover:opacity-90"
          >
            my portfolio
          </a>
          .
        </p>
        <a
          href="https://www.linkedin.com/in/tariq-kichawele"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Connect on LinkedIn
          <Linkedin className="w-4 h-4 ml-2" />
        </a>
      </div>
  </MaxWidthWrapper>
  )
}

export default About
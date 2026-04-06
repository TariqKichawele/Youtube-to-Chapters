'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/SubmitButton'
import { generateChapters } from './action'
import { useRouter } from 'next/navigation'

/** Real photo portraits (stock) for social proof—no illustrations. */
const TRUSTED_BY_AVATARS: { src: string; alt: string; fallback: string }[] = [
  {
    src: 'https://res.cloudinary.com/damqrrryq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1727277655/Screenshot_2024-09-13_141434-removebg-preview_lrwtuu.png',
    alt: 'Creator profile photo',
    fallback: 'AW',
  },
  {
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=faces&q=80',
    alt: 'Professional headshot of a woman smiling',
    fallback: 'CR',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces&q=80',
    alt: 'Professional headshot of a man',
    fallback: 'MK',
  },
  {
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=faces&q=80',
    alt: 'Professional headshot of a woman',
    fallback: 'JA',
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces&q=80',
    alt: 'Professional headshot of a man smiling',
    fallback: 'DW',
  },
  {
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=128&h=128&fit=crop&crop=faces&q=80',
    alt: 'Professional headshot of a woman with natural light',
    fallback: 'LB',
  },
]

const PageContent = () => {
  const router = useRouter();
    const handleSubmit = async(formData: FormData) => {
        const res = await generateChapters(formData);
        if(res.success) {
          router.push('/dashboard')
        } else {
          alert(res.error)
        }
    }
  return (
    <>
      <MaxWidthWrapper className="py-4 md:py-20">
        <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
          <div className="lg:col-span-3">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Generate timestamps for your YouTube videos
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Built for creators, by creators.
            </p>
            <form className="mt-5 lg:mt-8 flex flex-col sm:items-center gap-2 sm:flex-row sm:gap-3" action={handleSubmit}>
              <div className="w-full max-w-lg lg:w-auto">
                <label className="sr-only">Enter video URL</label>
                <Input placeholder="enter video URL" name="link" />
              </div>
              <SubmitButton text="Generate" />
            </form>
            <div className="mt-6 lg:mt-12">
              <span className="text-xs font-medium">Trusted by:</span>
              <div
                className="mt-4 flex flex-wrap items-center gap-2"
                role="list"
                aria-label="Creators who use this tool"
              >
                {TRUSTED_BY_AVATARS.map(({ src, alt, fallback }) => (
                  <Avatar
                    key={src}
                    role="listitem"
                    className="h-11 w-11 border-2 border-background shadow-sm ring-1 ring-border"
                  >
                    <AvatarImage src={src} alt={alt} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 mt-10 lg:mt-0">
            <Image
              className="w-full rounded-xl"
              src="https://res.cloudinary.com/damqrrryq/image/upload/v1727349411/pexels-divinetechygirl-1181244_tlg3ic.jpg"
              alt="demo image"
              width={800}
              height={450}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  )
}

export default PageContent
'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/SubmitButton'

const PageContent = () => {
    const handleSubmit = (formData: FormData) => {
        console.log(formData)
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
              <Avatar className="mt-4 flex gap-x-8">
                <AvatarImage src="https://res.cloudinary.com/damqrrryq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1727277655/Screenshot_2024-09-13_141434-removebg-preview_lrwtuu.png" />
                <AvatarFallback>AlfieWebDev</AvatarFallback>
              </Avatar>
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
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const getStartedHref = session ? "/generate-chapters" : "/signin";

  return (
    <div className="overflow-hidden">
      <MaxWidthWrapper>
        <div className="py-20 md:py-28 relative text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Turn your video into chapters viewers actually use.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Paste a YouTube link and get timestamped chapter lines for your
            description—powered by the video&apos;s captions and AI.
          </p>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
            Free generations each month to try. Works when the video has
            captions or subtitles—sign in with Google or Discord to get
            started.
          </p>
          <ul className="mt-8 space-y-2 max-w-md mx-auto text-left inline-block">
            {[
              "Paste any public YouTube watch link",
              "Copy-ready [mm:ss] chapter lines for your description",
              "Past runs saved on your dashboard",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckIcon
                  className="h-5 w-5 shrink-0 text-primary mt-0.5"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={getStartedHref}
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "group min-w-44 px-6",
              })}
            >
              Generate chapters
              <ChevronRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-w-44",
              })}
            >
              See pricing
            </Link>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Seconds, not scrubbing",
              description:
                "Drop in a public watch link and get copy-paste chapter lines—no rewatching the whole video to hunt for timestamps.",
            },
            {
              title: "Breakpoints from the transcript",
              description:
                "We use the video’s captions so splits and titles line up with how the conversation actually flows.",
            },
            {
              title: "Saved in your account",
              description:
                "Every generation lives on your dashboard—copy, reuse, or tidy up past chapter lists anytime.",
            },
          ].map((feature, index) => {
            return (
              <div
                className="bg-secondary/50 p-6 rounded-lg hover:shadow-md transition"
                key={index}
              >
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
      <div className="bg-gradient-to-b from-background to-secondary/20 py-20 md:py-28">
        <MaxWidthWrapper>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Built by Tariq Kichawele</h2>
            <p className="text-xl text-muted-foreground">
              Crafted with passion and expertise
            </p>
          </div>
          <div className="mt-10 relative max-w-3xl mx-auto">
            <Image
              src="https://res.cloudinary.com/damqrrryq/image/upload/v1727349411/pexels-divinetechygirl-1181244_tlg3ic.jpg"
              width={800}
              height={450}
              alt="demo image"
              className="rounded-xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg">
              <Link href="/about" className="font-medium hover:underline">
                Learn more about the creator
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

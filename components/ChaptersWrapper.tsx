"use client";

import { ChapterSet } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { FaSadTear } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Pagination,
  PaginationNext,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { Copy, Check, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import Clipboard from "clipboard";
import { deleteChapterSet } from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";

interface ChapterWrapperProps {
  user: {
    savedChapters: ChapterSet[];
    stripe_customer_id: string;
  };
}

const ITEMS_PER_PAGE = 9;

const ChaptersWrapper = ({ user }: ChapterWrapperProps) => {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentChapters = user.savedChapters.slice(startIndex, endIndex);
  const totalPages = Math.ceil(user.savedChapters.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (user.savedChapters.length === 0) {
      setCurrentPage(1);
      return;
    }
    const lastPage = Math.ceil(user.savedChapters.length / ITEMS_PER_PAGE);
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [user.savedChapters.length, currentPage]);

  const handleDelete = async (chapterId: string) => {
    if (!confirm("Delete this chapter generation? This cannot be undone.")) {
      return;
    }
    setDeletingId(chapterId);
    try {
      const result = await deleteChapterSet(chapterId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error ?? "Failed to delete");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const clipboard = new Clipboard(".btn-copy");

  useEffect(() => {
    clipboard.on("success", (e) => {
      setCopiedId(e.trigger.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      e.clearSelection();
    });

    return () => clipboard.destroy();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }    
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="mt-12 min-h-screen">
      {user?.savedChapters.length === 0 && (
        <div className="flex flex-col gap-4 mt-12 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-500">
            No chapters found <FaSadTear className="w-10 h-10" />
          </h1>
          <p className="text-gray-500">
            You do not have any chapters saved. Try generating some chapters for
            a YouTube video.
          </p>
        </div>
      )}
      {user?.savedChapters && user.savedChapters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12 min-h-screen">
          {currentChapters.map((chapter: ChapterSet) => (
            <div
              key={chapter.id}
              className="border border-gray-200 rounded-lg p-5 flex flex-col min-h-[300px] max-h-[min(32rem,70vh)] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="shrink-0 text-lg font-semibold leading-snug text-foreground mb-4 break-words">
                {chapter.title}
              </h2>
              <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-1">
                {chapter.content.map((line: string, index: number) => (
                  <p
                    key={index}
                    className="text-sm text-gray-600 leading-relaxed mb-1.5 last:mb-0"
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex gap-2 shrink-0 items-stretch">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={`flex-1 flex justify-center items-center space-x-2 btn-copy ${
                          copiedId === chapter.id ? "bg-green-500" : ""
                        }`}
                        variant={"outline"}
                        id={chapter.id}
                        data-clipboard-text={chapter.content.join("\n")}
                      >
                        {copiedId === chapter.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                        <span>
                          {copiedId === chapter.id ? "Copied" : "Copy"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {copiedId === chapter.id
                          ? "Copied To Clipboard!"
                          : "Copy chapters to clipboard!"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingId === chapter.id}
                        aria-label="Delete this chapter generation"
                        onClick={() => handleDelete(chapter.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete this generation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      )}
      {user?.savedChapters.length > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ChaptersWrapper;

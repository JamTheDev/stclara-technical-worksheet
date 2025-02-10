"use client";
import React, { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import {
  MarkdownState,
  useMarkdownDispatch,
  useMarkdownSelector,
} from "@/lib/store";
import {
  upsertMarkdownNote,
  getMarkdownNote,
} from "@/lib/actions/markdown.actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const uploadMarkdownFile = async (fileName: string, content: string) => {
  console.log(`Uploading ${fileName} with content:`, content);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [title, setTitle] = useState<string>("New notes title");

  const params = useParams();
  const router = useRouter();

  const dispatch = useMarkdownDispatch();
  const { loading } = useMarkdownSelector(
    (state: MarkdownState) => state.markdown
  );

  useEffect(() => {
    const processMarkdown = async () => {
      const file = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(markdown);
      setHtml(String(file));
    };
    processMarkdown();
  }, [markdown]);

  useEffect(() => {
    if (params.slug != "new") {
      dispatch(getMarkdownNote(params.slug as string)).then(
        async (data: any) => {
          const response = await fetch(data.payload.attachment);
          const markdownContent = await response.blob();

          const content = await markdownContent.text();
          const file = await unified()
            .use(remarkParse)
            .use(remarkHtml)
            .process(content);

          setHtml(file.toString());
          setMarkdown(content);
          toast.success("Note loaded!");
        }
      );
    } else {
      setHtml("# Hello, Markdown Editor!");
    }
  }, [params.slug]);

  const handleSaveNote = async () => {
    const fileName = `${title}.md`;
    const blob = new Blob([markdown], { type: "text/markdown" });

    toast.promise(
      dispatch(
        upsertMarkdownNote({
          id:
            !params.slug ||
            (Array.isArray(params.slug) ? params.slug[0] : params.slug) ===
              "new"
              ? undefined
              : Array.isArray(params.slug)
              ? params.slug[0]
              : params.slug,
          markdownFile: new File([blob], fileName),
          name: title,
          createdAt: (params.slug as string) == "new" ? undefined : new Date(),
        })
      ),
      {
        loading: "Saving note...",
        success: (data: any) => {
          if (params.slug === "new")
            router.replace(`/md/editor/${data.payload.id}`);
          return "Note saved!";
        },
        error: "Failed to save note",
      }
    );
  };

  // Determine if save is disabled
  const isSaveDisabled = markdown === "" || markdown === undefined || loading;

  return (
    <div className="container mx-auto py-10 p-6 h-[700px]">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className={`h-10 transition-colors text-black px-4`}
        >
          Back
        </button>
        <input
          className="h-10 border border-black text-black rounded-md px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter note title"
          value={title}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSaveNote}
          disabled={isSaveDisabled}
          className={`h-10 rounded-md shadow-lg transition-colors 
                                                ${
                                                  isSaveDisabled
                                                    ? "bg-green-300 cursor-not-allowed opacity-50"
                                                    : "bg-green-500 hover:bg-green-300 active:bg-green-400"
                                                } 
                                        text-black px-4`}
        >
          Save Note
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 h-[500px]">
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Notes in Markdown
          </h2>
          <textarea
            className="w-full flex-1 p-2 border border-black rounded resize-none text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            disabled={loading}
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-black">Preview</h2>
          <div
            className="w-full flex-1 p-4 border border-black rounded overflow-auto text-black prose prose-lg bg-white"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;

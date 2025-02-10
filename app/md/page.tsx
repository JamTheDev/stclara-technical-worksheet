"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useMarkdownDispatch, useMarkdownSelector } from "@/lib/store";
import {
  deleteMarkdownNote,
  getAllMarkdownNotes,
} from "@/lib/actions/markdown.actions";

const MarkdownListPage: React.FC = () => {
  const dispatch = useMarkdownDispatch();
  const { notes, loading, error } = useMarkdownSelector(
    (state) => state.markdown
  );

  useEffect(() => {
    dispatch(getAllMarkdownNotes());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-black font-bold text-center mb-10">
        My Notes
      </h1>
      {loading ? (
        <p className="text-center text-gray-700">Loading notes...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-gray-600">
          No markdown notes available.
        </p>
      ) : (
        <ul className="grid gap-6">
          {notes.map((note) =>
            note != undefined && note.id != undefined ? (
              <li key={note.id} className="flex flex-row  gap-4">
                <Link
                  href={`/md/editor/${note.id}`}
                  className="flex flex-row flex-1 p-6 border border-gray-200 rounded-lg text-gray-900 shadow hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <div className="flex-1">
                    <h2 className="font-bold text-3xl">{note.name}</h2>
                    <h4 className="text-xl">
                      Created at:{" "}
                      {new Date(note.createdAt).toLocaleDateString()}
                    </h4>
                  </div>
                  <div className="flex-1 flex flex-col items-end justify-center">
                    <span>Open</span>
                  </div>
                </Link>

                <button
                  onClick={() => dispatch(deleteMarkdownNote(note.id!))}
                  className="z-10 p-2 grid place-items-center bg-red-500 rounded-lg shadow-lg cursor-pointer hover:bg-red-600 transition-colors"
                >
                  <span>Delete</span>
                </button>
              </li>
            ) : null
          )}
        </ul>
      )}

      <Link
        href={`/md/editor/new`}
        className="group grid place-items-center w-full h-8 py-5"
      >
        <span className="text-black group-hover:text-blue-500 transition-colors">
          Create new note
        </span>
      </Link>
    </div>
  );
};

export default MarkdownListPage;

"use client";

import { getAllAttachments, createAttachment, updateAttachment, deleteAttachment } from "@/lib/actions/attachment.actions";
import { useAttachmentDispatch, useAttachmentSelector } from "@/lib/store";
import React, { useEffect, useState, ChangeEvent } from "react";


const NeoDrivePage = () => {
    const dispatch = useAttachmentDispatch();
    const { attachments, loading, error } = useAttachmentSelector(
        (state) => state.attachments
    );
    const [newFile, setNewFile] = useState<File | null>(null);
    const [search, setSearch] = useState("");
    const [sortByName, setSortByName] = useState(false);
    const [sortDateAsc, setSortDateAsc] = useState(false);
    const [updateFileId, setUpdateFileId] = useState<string | null>(null);
    const [updateFile, setUpdateFile] = useState<File | null>(null);

    const loadAttachments = () => {
        dispatch(getAllAttachments({ search, sortByName, sortDateAsc }));
    };

    useEffect(() => {
        loadAttachments();
    }, [search, sortByName, sortDateAsc, dispatch]);

    const handleNewFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith("image/")) {
                setNewFile(file);
            } else {
                alert("Please select an image file only.");
            }
        }
    };

    const handleUpload = async () => {
        if (newFile) {
            await dispatch(createAttachment({ file: newFile }));
            setNewFile(null);
            loadAttachments();
        }
    };

    const handleUpdateFileChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith("image/")) {
                setUpdateFileId(id);
                setUpdateFile(file);
            } else {
                alert("Please select an image file only.");
            }
        }
    };

    const handleUpdate = async (id: string) => {
        if (updateFile && updateFileId === id) {
            await dispatch(updateAttachment({ id, file: updateFile }));
            setUpdateFile(null);
            setUpdateFileId(null);
            loadAttachments();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this photo?")) {
            await dispatch(deleteAttachment(id));
            loadAttachments();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                NeoDrive
            </h1>

            <div className="max-w-3xl mx-auto bg-white shadow rounded p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Upload New Photo</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewFileChange}
                    className="mb-4 block"
                />
                <button
                    onClick={handleUpload}
                    disabled={!newFile || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                    {loading ? "Uploading..." : "Upload Photo"}
                </button>
            </div>

            <div className="max-w-3xl mx-auto bg-white shadow rounded p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search by photo name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded p-2 w-full md:w-1/2 mb-2 md:mb-0"
                    />
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSortByName((prev) => !prev)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                        >
                            Sort by Name {sortByName ? "↑" : "↓"}
                        </button>
                        <button
                            onClick={() => setSortDateAsc((prev) => !prev)}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded"
                        >
                            Sort by Date {sortDateAsc ? "↑" : "↓"}
                        </button>
                    </div>
                </div>

                {loading && <p className="text-gray-600">Loading photos...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {attachments.map((att) => (
                        <div
                            key={att.id}
                            className="bg-gray-100 rounded shadow overflow-hidden flex flex-col"
                        >
                            <img
                                src={att.url}
                                alt="Photo"
                                className="object-cover h-48 w-full"
                            />
                            <div className="p-4 flex-grow flex flex-col">
                                {/* Assuming the attachment record has a 'name' field */}
                                <p className="font-medium text-gray-700 mb-2">
                                    {(att as any).name || "Unnamed Photo"}
                                </p>
                                <p className="text-xs text-gray-500 mb-4">
                                    {new Date(att.createdAt).toLocaleString()}
                                </p>

                                {updateFileId === att.id ? (
                                    <div className="mb-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleUpdateFileChange(e, att.id)
                                            }
                                            className="mb-2 block"
                                        />
                                        <button
                                            onClick={() => handleUpdate(att.id)}
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-2 rounded"
                                        >
                                            {loading ? "Updating..." : "Confirm Update"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2 mt-auto">
                                        <label className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-2 rounded cursor-pointer text-center">
                                            Update
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleUpdateFileChange(e, att.id)
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            onClick={() => handleDelete(att.id)}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NeoDrivePage;
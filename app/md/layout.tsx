"use client";

import { makeMarkdownStore } from "@/lib/store";
import { Provider } from "react-redux";

export default function MarkdownRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={makeMarkdownStore()}>
      <div className="w-screen h-screen bg-white overflow-y-scroll">
        {children}
      </div>
    </Provider>
  );
}

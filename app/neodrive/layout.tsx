"use client";

import { makeAttachmentStore, makeTodolistStore } from "@/lib/store";
import { Provider } from "react-redux";

export default function SecretRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={makeAttachmentStore()}>{children}</Provider>;
}

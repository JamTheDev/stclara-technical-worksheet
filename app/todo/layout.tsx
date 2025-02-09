"use client";

import { makeTodolistStore } from "@/lib/store";
import { Provider } from "react-redux";

export default function TodoRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={makeTodolistStore()}>{children}</Provider>;
}

"use client";

import { makeFoodGalleryStore, makeTodolistStore } from "@/lib/store";
import { Provider } from "react-redux";

export default function FoodGalleryRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={makeFoodGalleryStore()}>
      <div className="w-screen h-screen bg-white overflow-y-scroll">{children}</div>
    </Provider>
  );
}

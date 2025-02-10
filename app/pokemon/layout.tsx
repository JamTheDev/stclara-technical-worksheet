"use client";

import { makePokemonStore } from "@/lib/store";
import { Provider } from "react-redux";

export default function PokemonRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={makePokemonStore()}>
      <div className="w-screen h-screen bg-white overflow-y-scroll">
        {children}
      </div>
    </Provider>
  );
}

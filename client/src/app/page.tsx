"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/chat");
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className=" flex items-center h-screen justify-center text-lg">
      <h1> Hello World</h1>
    </main>
  );
}

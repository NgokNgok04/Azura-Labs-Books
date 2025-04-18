"use client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-black">Welcome to the Books</h1>
        <p className="text-lg text-gray-700">Explore our collection of books</p>
      </header>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border-2 border-gray-300 bg-white p-5 shadow-lg">
          <h2 className="text-xl font-semibold">Fiction</h2>
          <p className="text-gray-600">Discover the best fiction books.</p>
        </div>
        <div className="rounded-lg border-2 border-gray-300 bg-white p-5 shadow-lg">
          <h2 className="text-xl font-semibold">Education</h2>
          <p className="text-gray-600">Explore our education collection.</p>
        </div>
        <div className="rounded-lg border-2 border-gray-300 bg-white p-5 shadow-lg">
          <h2 className="text-xl font-semibold">Philosophy Books</h2>
          <p className="text-gray-600">Find books for young readers.</p>
        </div>
        <Button onClick={() => router.push("/books")}>Get Started</Button>
      </main>
    </div>
  );
}

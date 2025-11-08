"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900">
            Task Management System
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Redirecting to login...
          </p>
        </div>
      </div>
    </div>
  );
}

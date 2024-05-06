import { Suspense } from "react";

export default function MemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}

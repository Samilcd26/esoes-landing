import { LoaderOne } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <LoaderOne />
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
} 
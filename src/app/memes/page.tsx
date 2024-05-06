import Anjinator from "@components/anjinator";

export default function AnjinatorMemePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <h1 className="text-3xl font-bold">Anjinator</h1>
      <Anjinator />
    </div>
  );
}

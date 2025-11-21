import DiagonalShimmer from "@/components/skeletons/shimmer";

export default function Test() {
  return (
    <div className="p-4 border rounded-xl space-y-3">
      <DiagonalShimmer className="h-40 w-full" />
      <DiagonalShimmer className="h-4 w-3/4" />
      <DiagonalShimmer className="h-4 w-1/2" />
    </div>
  );
}

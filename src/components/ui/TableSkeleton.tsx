interface TableSkeletonProps {
  rows?: number;
}

export const TableSkeleton = ({ rows = 5 }: TableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-panel">
      <div className="grid min-w-[760px] grid-cols-5 gap-4 border-b border-surface-200 px-6 py-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="h-4 animate-pulse rounded-full bg-surface-100" key={index} />
        ))}
      </div>
      <div className="space-y-4 overflow-x-auto px-6 py-4">
        {Array.from({ length: rows }, (_, index) => (
          <div className="grid min-w-[760px] grid-cols-5 gap-4" key={index}>
            {Array.from({ length: 5 }, (_, cellIndex) => (
              <div className="h-4 animate-pulse rounded-full bg-surface-100" key={cellIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

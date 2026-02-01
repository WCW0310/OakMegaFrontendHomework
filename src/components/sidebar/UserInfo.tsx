import type { UserProfile } from "../../types";

interface Props {
  user: UserProfile;
  totalStops: number;
  filteredCount: number;
}

export function UserInfo({ user, totalStops, filteredCount }: Props) {
  const isFiltered = totalStops > 0 && filteredCount !== totalStops;

  return (
    <div className="flex items-center justify-between mt-3">
      <p className="text-sm text-blue-100">
        Hi, <span className="font-medium text-white">{user.google?.name}</span>
      </p>
      <span
        className={`text-xs px-2.5 py-1 rounded-full text-white transition-colors font-medium ${
          isFiltered ? "bg-yellow-500/90" : "bg-blue-500"
        }`}
      >
        {totalStops === 0
          ? "搜尋中..."
          : isFiltered
            ? `共 ${filteredCount}/${totalStops} 筆`
            : `共 ${totalStops} 筆`}
      </span>
    </div>
  );
}

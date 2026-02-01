import type { UserProfile } from "../../types";

interface Props {
  user: UserProfile;
  totalStops: number;
  filteredCount: number;
}

export function UserInfo({ user, totalStops, filteredCount }: Props) {
  return (
    <div className="flex items-center justify-between mt-3">
      <p className="text-sm text-blue-100">
        Hi, <span className="font-medium text-white">{user.google?.name}</span>
      </p>
      <span className="text-xs bg-blue-500 px-2 py-1 rounded-full text-white">
        {totalStops === 0 ? "搜尋中..." : `共 ${filteredCount} 筆`}
      </span>
    </div>
  );
}

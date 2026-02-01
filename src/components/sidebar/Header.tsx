import type { UserProfile } from "../../types";

interface Props {
  user: UserProfile;
  onLogout: () => void;
}

export function Header({ user, onLogout }: Props) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-bold flex items-center gap-2 text-white">
        附近的都更地點
      </h2>

      {/* User Info & Logout (Compact) */}
      <div className="flex items-center gap-2 bg-blue-700/50 rounded-full pl-3 pr-1 py-1 border border-blue-500/30">
        <span className="text-xs text-blue-100 max-w-20 truncate">
          {user.google?.name}
        </span>
        <button
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1 transition-colors"
          title="登出"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-5M12 12h9.75"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

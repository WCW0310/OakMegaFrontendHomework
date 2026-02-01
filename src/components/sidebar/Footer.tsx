interface Props {
  onLogout: () => void;
}

export function Footer({ onLogout }: Props) {
  return (
    <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-all font-bold border border-gray-200 hover:border-red-200"
      >
        🚪 登出系統
      </button>
    </div>
  );
}

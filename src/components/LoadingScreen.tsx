export function LoadingScreen({
  message = "資料載入中...",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <div className="text-xl font-bold text-gray-600 animate-pulse">
          {message}
        </div>
      </div>
    </div>
  );
}

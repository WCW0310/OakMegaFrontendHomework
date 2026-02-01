import type { UserProfile } from "../types";

interface Props {
  user: UserProfile;
  onFBLogin: () => void;
}

export function BindStep({ user, onFBLogin }: Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        歡迎, {user.google?.name}
      </h1>
      <div className="rounded-xl bg-white p-8 shadow-lg text-center w-full max-w-md">
        <img
          src={user.google?.picture}
          alt="avatar"
          className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-white shadow-sm"
        />
        <p className="mb-6 text-red-500 font-bold bg-red-50 p-3 rounded-lg">
          ⚠️ 需綁定 Facebook 帳號才能查看地圖資料
        </p>
        <button
          onClick={onFBLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] py-3 text-white hover:bg-[#166fe5] font-bold transition-colors cursor-pointer"
        >
          綁定 Facebook 帳號
        </button>
      </div>
    </div>
  );
}

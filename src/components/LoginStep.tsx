import type { RefObject } from "react";

interface LoginStepProps {
  googleBtnRef: RefObject<HTMLDivElement | null>;
}

export function LoginStep({ googleBtnRef }: LoginStepProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        新北市都更查詢系統
      </h1>
      <div className="rounded-xl bg-white p-8 shadow-lg text-center w-full max-w-md">
        <p className="mb-6 text-gray-600">請先使用 Google 帳號登入以繼續</p>
        <div ref={googleBtnRef} className="flex justify-center h-11"></div>
      </div>
    </div>
  );
}

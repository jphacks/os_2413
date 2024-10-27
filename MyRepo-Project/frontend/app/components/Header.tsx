// app/components/Header.tsx

import { Search, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">My report</h1>
          </Link>
          {/* 検索バー */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 右側のアイテム */}
          <div className="flex items-center space-x-6 ml-4">
            {/* 通知ベル */}
            <button className="hover:bg-gray-100 p-2 rounded-full">
              <Bell size={20} className="text-gray-600" />
            </button>

            {/* ユーザーアイコン */}
            <button className="hover:bg-gray-100 p-1 rounded-full">
              <img
                src="./images/photo-icon.png"
                alt="User profile"
                className="w-8 h-8 rounded-full"
              />
            </button>

            {/* ログインボタン */}
            <Link href="/github-auth">
              <button className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900">
                <span>Log in</span>
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

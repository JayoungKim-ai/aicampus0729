import React from "react";

function Footer() {
  return (
    <footer className="mt-16 border-t border-primary-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">
            T
          </div>
          <span className="font-bold text-heading-md text-gray-900">
            TeamFlow
          </span>
        </div>

        <p className="text-caption text-gray-400 text-center leading-relaxed">
          프론트엔드 · 백엔드 · AI · 디자인 — 함께 만드는 더 나은 서비스
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-2">
          <a
            href="#"
            className="text-caption text-gray-400 font-medium hover:text-primary-500 transition-colors"
          >
            이용약관
          </a>
          <a
            href="#"
            className="text-caption text-gray-400 font-medium hover:text-primary-500 transition-colors"
          >
            개인정보처리방침
          </a>
          <a
            href="#"
            className="text-caption text-gray-400 font-medium hover:text-primary-500 transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-caption text-gray-400 font-medium hover:text-primary-500 transition-colors"
          >
            문의하기
          </a>
        </div>

        <div className="w-full h-px bg-gray-100 mt-6 mb-2" />

        <div className="text-caption text-gray-300">
          Made with ❤️ by TeamFlow © 2025
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// src/pages/FestivalDetailPage.jsx
// 축제 상세 화면 — 지금은 목 데이터로 모양만 만든다.
// 나중에 useParams 로 id 를 꺼내고 GET /festivals/detail/{id} 로 바꾼다.

// ===================== 목 데이터 (1건) =====================
// 필드 이름은 API 명세의 FestivalDetail 과 똑같이 맞춰 둔다.
// 그래야 나중에 서버 응답으로 바꿔도 화면 코드를 안 고쳐도 된다.
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE = "http://127.0.0.1:8000";

// ===================== 상태별 배지 색 =====================
const STATUS_STYLE = {
  진행중: "bg-emerald-50 text-emerald-700",
  "오늘 종료": "bg-rose-50 text-rose-700",
  예정: "bg-amber-50 text-amber-700",
  종료: "bg-gray-100 text-gray-500",
};
const STATUS_STYLE_DEFAULT = "bg-gray-100 text-gray-500";

// 서버는 "2026-07-25" 로 준다. 화면에서만 점을 찍어 보여준다.
function toDot(date) {
  return date ? date.replaceAll("-", ".") : "";
}

// 한 줄짜리 항목의 공통 모양
const ROW =
  "flex flex-col md:flex-row gap-1 md:gap-4 px-5 md:px-6 py-4 border-t border-gray-100";
const LABEL = "md:w-24 shrink-0 text-caption font-semibold text-gray-400";
const VALUE = "text-caption md:text-body text-gray-700 leading-relaxed";
const LINK =
  "text-caption md:text-body font-semibold text-primary-500 hover:underline break-all";

export default function FestivalDetailPage() {
  const [festival, setFestival] = useState({});
  const period = `${toDot(festival.start_date)} ~ ${toDot(festival.end_date)}`;

  const { id } = useParams();

  useEffect(() => {
    async function loadFestival() {
      const response = await fetch(`${API_BASE}/festivals/detail/${id}`);
      const data = await response.json();
      setFestival(data);
    }
    loadFestival();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-10 pb-12 md:pb-16">
        {/* ===================== 목록으로 ===================== */}
        {/* 라우터를 붙인 뒤에는 <Link to="/"> 로 바꾼다 */}
        <Link
          to="/festivals"
          className="inline-block text-caption font-semibold text-gray-500 hover:text-primary-500 transition-colors mb-5"
        >
          ← 목록으로
        </Link>

        {/* ===================== 제목 영역 ===================== */}
        {/* 가장 궁금한 것(이름·기간)과 행동 버튼은 표 밖으로 꺼낸다 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-heading-lg md:text-heading-xl font-black text-gray-900 tracking-tight">
                {festival.name}
              </h1>
              <span
                className={`inline-block text-caption font-bold px-2 py-0.5 rounded-md ${
                  STATUS_STYLE[festival.status] ?? STATUS_STYLE_DEFAULT
                }`}
              >
                {festival.status}
              </span>
            </div>
            <p className="text-caption md:text-body font-semibold text-primary-500">
              {period}
            </p>
          </div>

          {/* 행동 버튼 — 좁은 화면에서는 제목 아래로 내려온다 */}
          <div className="flex shrink-0 items-center gap-2">
            <button className="h-10 px-4 rounded-lg bg-white border border-gray-200 text-caption font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              ↗ 링크 공유
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-gray-200 text-caption font-bold text-gray-600 hover:text-primary-500 hover:border-primary-100 hover:bg-primary-50 transition-colors">
              ☆ 즐겨찾기
            </button>
          </div>
        </div>

        {/* ===================== 상세 정보 ===================== */}
        {/* 항목-값 쌍이 여덟 개라 표 형태가 읽기 좋다 */}
        {/* 좁은 화면: 라벨 위 / 값 아래   넓은 화면: 라벨 왼쪽 / 값 오른쪽 */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
          {/* 개최장소 */}
          <div className={ROW + " border-t-0"}>
            <span className={LABEL}>개최장소</span>
            <span className={VALUE}>{festival.place}</span>
          </div>

          {/* 개최기간 */}
          <div className={ROW}>
            <span className={LABEL}>개최기간</span>
            <span className={VALUE}>{period}</span>
          </div>

          {/* 축제내용 */}
          <div className={ROW}>
            <span className={LABEL}>축제내용</span>
            <span className={VALUE}>{festival.content}</span>
          </div>

          {/* 주관기관 */}
          <div className={ROW}>
            <span className={LABEL}>주관기관</span>
            <span className={VALUE}>{festival.manage_org}</span>
          </div>

          {/* 주최기관 */}
          <div className={ROW}>
            <span className={LABEL}>주최기관</span>
            <span className={VALUE}>{festival.host_org}</span>
          </div>

          {/* 전화번호 — 누르면 전화 앱이 열린다 */}
          <div className={ROW}>
            <span className={LABEL}>전화번호</span>
            <a href={`tel:${festival.phone}`} className={LINK}>
              {festival.phone}
            </a>
          </div>

          {/* 홈페이지 — 새 탭에서 열린다 */}
          <div className={ROW}>
            <span className={LABEL}>홈페이지</span>
            <a
              href={festival.homepage}
              target="_blank"
              rel="noreferrer"
              className={LINK}
            >
              {festival.homepage}
            </a>
          </div>

          {/* 지번주소 */}
          <div className={ROW}>
            <span className={LABEL}>지번주소</span>
            <span className={VALUE}>{festival.address}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// src/pages/FestivalPage.jsx
// 축제 찾기 페이지 (UI 전용 · state 없음 · 고정 화면 · 반응형)
// 기준: 모바일 우선(mobile first) → md(768px) 이상에서 데스크톱 레이아웃으로 전환
import { useState, useEffect } from "react";
import FestivalItem from "../components/FestivalItem";

// ===================== 상태 탭 =====================
const tabs = ["전체", "진행중", "예정", "종료"];
const ACTIVE_TAB = "전체"; // 고정 화면이므로 선택된 탭을 상수로 지정
const API_BASE = "http://127.0.0.1:8000";

export default function FestivalPage() {
  const [festivals, setFestivals] = useState([]); // 축제목록
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API로 데이터 요청
    async function loadFestivals() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/festivals`);
        if (!response.ok) {
          throw new Error(`오류발생:${response.status}`);
        }
        const data = await response.json();
        setFestivals(data.items);
        setTotal(data.total);
      } catch (e) {
        setError(e.message);
        setFestivals([]);
      } finally {
        setLoading(false);
      }
    }
    loadFestivals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-14 pb-12 md:pb-16">
        {/* ===================== 페이지 타이틀 ===================== */}
        <h1 className="text-heading-lg md:text-heading-xl font-black text-gray-900 tracking-tight mb-2 md:mb-3">
          축제 찾기
        </h1>
        <p className="text-caption md:text-body text-gray-500 leading-relaxed mb-6 md:mb-8">
          전국에서 열리는 축제를 지역·날짜·축제명으로 찾아보세요.
        </p>

        {/* ===================== 상태 탭 ===================== */}
        <div className="grid grid-cols-4 gap-1 bg-white border border-primary-100 rounded-2xl p-1.5 shadow-soft mb-5 md:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={
                tab === ACTIVE_TAB
                  ? "py-2 md:py-2.5 rounded-xl bg-primary-500 text-white text-caption md:text-body font-bold"
                  : "py-2 md:py-2.5 rounded-xl text-caption md:text-body font-medium text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===================== 검색 영역 ===================== */}
        {/* 모바일: 세로로 쌓임 / md 이상: 한 줄 배치 */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-5">
            {/* 지역 + 날짜 : 모바일에서는 둘이 한 줄을 나눠 가짐 */}
            <div className="flex gap-3 md:gap-5 md:shrink-0">
              {/* 지역 선택 */}
              <div className="flex-1 min-w-0 md:flex-none md:w-40 flex flex-col gap-1.5">
                <label className="text-caption font-semibold text-gray-600">
                  지역
                </label>
                <select className="h-11 w-full px-3 rounded-lg border border-primary-100 bg-white text-caption md:text-body text-gray-700 outline-none">
                  <option>전체 지역</option>
                  <option>경기도</option>
                  <option>부산광역시</option>
                </select>
              </div>

              {/* 날짜 선택 */}
              <div className="flex-1 min-w-0 md:flex-none md:w-44 flex flex-col gap-1.5">
                <label
                  htmlFor="startDate"
                  className="text-caption font-semibold text-gray-600"
                >
                  날짜
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="h-11 w-full px-3 rounded-lg border border-primary-100 bg-white text-caption md:text-body text-gray-700 outline-none"
                />
              </div>
            </div>

            {/* 축제명 + 검색 버튼 */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-caption font-semibold text-gray-600">
                축제명
              </label>
              <div className="flex gap-2">
                {/* min-w-0: 입력창이 버튼을 밀어내지 않고 줄어들 수 있게 함 */}
                <input
                  type="text"
                  placeholder="예: 불꽃축제, 벚꽃축제"
                  className="h-11 flex-1 min-w-0 px-4 rounded-lg border border-primary-100 bg-white text-caption md:text-body text-gray-700 outline-none placeholder:text-gray-300"
                />
                <button className="h-11 shrink-0 px-5 md:px-6 rounded-lg bg-primary-500 text-white text-caption md:text-body font-bold shadow-sm hover:bg-primary-700 transition-colors">
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 결과 요약 ===================== */}
        <p className="text-caption md:text-body font-semibold text-gray-700 mb-3 md:mb-4">
          전체 {total.toLocaleString()}건{" "}
        </p>

        {/* ===================== 축제 카드 목록 ===================== */}
        {/* 모바일: 1열 / md 이상: 2열 */}
        {loading && <div>로딩중...</div>}
        {error && <div>{error}</div>}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {festivals.map((festival) => (
            <FestivalItem key={festival.id} festival={festival} />
          ))}
        </ul>

        {/* ===================== 페이지네이션 ===================== */}
        <div className="flex items-center justify-center gap-5 mt-8 md:mt-10">
          <button
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-300 text-caption md:text-body font-semibold"
            disabled
          >
            이전
          </button>
          <span className="text-caption md:text-body font-semibold text-gray-700">
            1 / 2
          </span>
          <button className="px-5 py-2 rounded-lg bg-white border border-primary-100 text-primary-500 text-caption md:text-body font-bold hover:bg-primary-50 transition-colors">
            다음
          </button>
        </div>
      </section>
    </div>
  );
}

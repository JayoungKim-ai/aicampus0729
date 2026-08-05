import { Star } from "lucide-react";
import { Link } from "react-router-dom";

// ===================== 상태별 배지 색 =====================
// 상태 문자열 → Tailwind 클래스를 짝지어 두는 표.
// if / else 를 길게 쓰는 대신 객체에서 꺼내 쓰면 상태가 늘어나도 한 줄만 추가하면 됨.
const STATUS_STYLE = {
  진행중: "bg-emerald-50 text-emerald-700",
  "오늘 종료": "bg-rose-50 text-rose-700",
  예정: "bg-amber-50 text-amber-700",
  종료: "bg-gray-100 text-gray-500",
};
const STATUS_STYLE_DEFAULT = "bg-gray-100 text-gray-500"; // 표에 없는 상태가 오면 사용

function FestivalItem({ festival }) {
  return (
    <li className="bg-white rounded-2xl border border-gray-200 p-5 shadow-soft hover:shadow-card hover:border-primary-100 md:hover:-translate-y-1 transition-all duration-300">
      {/* 카드 헤더: 상태 배지 + 축제명 / 상세 보기 + 즐겨찾기 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-block text-caption font-bold px-2 py-0.5 rounded-md ${
              STATUS_STYLE[festival.status] ?? STATUS_STYLE_DEFAULT
            }`}
          >
            {festival.status}
          </span>
          <h3 className="mt-2 text-body md:text-heading-md font-extrabold text-gray-900 leading-snug">
            {festival.name}
          </h3>
        </div>

        {/* 버튼 묶음: 카드 높이를 늘리지 않도록 헤더 오른쪽에 함께 배치 */}
        <div className="shrink-0 flex items-center gap-2">
          <Link to={`/festivals/${festival.id}`}>
            <button className="text-caption font-bold text-primary-500 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors">
              상세 보기
            </button>
          </Link>
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-100 hover:bg-primary-50 transition-colors">
            <Star size={18} />
          </button>
        </div>
      </div>

      {/* 카드 본문: 개최기간 / 개최장소 / 주소 */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex flex-col gap-1.5">
        <div className="flex gap-3">
          <span className="w-14 md:w-16 shrink-0 text-caption font-medium text-gray-400">
            개최기간
          </span>
          <span className="text-caption font-semibold text-gray-700">
            {festival.start_date} ~ {festival.end_date}
          </span>
        </div>
        <div className="flex gap-3">
          <span className="w-14 md:w-16 shrink-0 text-caption font-medium text-gray-400">
            개최장소
          </span>
          <span className="text-caption text-gray-600">{festival.place}</span>
        </div>
        <div className="flex gap-3">
          <span className="w-14 md:w-16 shrink-0 text-caption font-medium text-gray-400">
            주소
          </span>
          <span className="text-caption text-gray-600">{festival.address}</span>
        </div>
      </div>
    </li>
  );
}

export default FestivalItem;

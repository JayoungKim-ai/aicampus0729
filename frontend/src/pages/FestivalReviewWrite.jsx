// 축제 후기 작성 페이지 — POST /festivals/{id}/reviews

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function FestivalReviewWrite() {
  // URL: /festivals/review/:id  →  축제 id
  const { id } = useParams();
  const navigate = useNavigate();

  const [festivalName, setFestivalName] = useState("");
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 어떤 축제에 쓰는지 제목만 보여 주기
  useEffect(() => {
    async function loadName() {
      try {
        const res = await fetch(`${API_BASE}/festivals/detail/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setFestivalName(data.name || "");
      } catch {
        // 제목을 못 받아도 작성은 가능하므로 조용히 넘어감
      }
    }
    loadName();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault(); // form 기본 새로고침 막기
    setError(null);

    const trimmedNick = nickname.trim();
    const trimmedContent = content.trim();
    if (!trimmedNick || !trimmedContent) {
      setError("닉네임과 후기 내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/festivals/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: trimmedNick,
          rating: Number(rating),
          content: trimmedContent,
        }),
      });

      if (!res.ok) {
        // 422(검증 실패) 등
        const detail = await res.json().catch(() => null);
        throw new Error(
          detail?.detail
            ? JSON.stringify(detail.detail)
            : `서버 오류 (${res.status})`,
        );
      }

      // 작성 성공 → 상세 페이지로 이동
      navigate(`/festivals/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="max-w-xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-10 pb-12 md:pb-16">
        <Link
          to={`/festivals/${id}`}
          className="inline-block text-caption font-semibold text-gray-500 hover:text-primary-500 transition-colors mb-5"
        >
          ← 상세로
        </Link>

        <h1 className="text-heading-lg md:text-heading-xl font-black text-gray-900 tracking-tight mb-2">
          후기 작성
        </h1>
        <p className="text-caption md:text-body text-gray-500 mb-6 md:mb-8">
          {festivalName
            ? `${festivalName}에 대한 후기를 남겨 주세요.`
            : "이 축제에 대한 후기를 남겨 주세요."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-soft flex flex-col gap-5"
        >
          {/* 닉네임 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nickname"
              className="text-caption font-semibold text-gray-600"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 축제러버"
              className="h-11 px-4 rounded-lg border border-primary-100 bg-white text-caption md:text-body text-gray-700 outline-none placeholder:text-gray-300"
            />
          </div>

          {/* 별점 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rating"
              className="text-caption font-semibold text-gray-600"
            >
              별점
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="h-11 px-3 rounded-lg border border-primary-100 bg-white text-caption md:text-body text-gray-700 outline-none"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)}
                  {"☆".repeat(5 - n)} ({n}점)
                </option>
              ))}
            </select>
          </div>

          {/* 내용 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="content"
              className="text-caption font-semibold text-gray-600"
            >
              후기 내용
            </label>
            <textarea
              id="content"
              rows={6}
              maxLength={1000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="축제에서 느낀 점을 자유롭게 적어 주세요."
              className="px-4 py-3 rounded-lg border border-primary-100 bg-white text-caption md:text-body text-gray-700 outline-none placeholder:text-gray-300 resize-y"
            />
          </div>

          {error && (
            <p className="text-caption font-semibold text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-lg bg-primary-500 text-white text-caption md:text-body font-bold shadow-sm hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {submitting ? "등록 중..." : "후기 등록"}
          </button>
        </form>
      </section>
    </div>
  );
}

'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState, useRef } from 'react'
import CommentEditor from './ui/CommentEditor'
import StarRatingInput from './ui/StarRatingInput'

interface CommentType {
  _id: string
  content: string
  contentRate: number
  homeworkRate: number
  examRate: number
  likes: number
  user: string
  createdAt: string
}

export default function CourseDetailClient({ courseId }: { courseId: string }) {
  const { user } = useUser()

  // 댓글 목록
  const [comments, setComments] = useState<CommentType[]>([])
  const [sort, setSort] = useState<'latest' | 'like'>('latest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // 평균 별점
  const [avg, setAvg] = useState({
    avgContent: 0,
    avgHomework: 0,
    avgExam: 0,
    total: 0,
  })

  // =============================
  // ⭐ 평균 별점 불러오기
  // =============================
  async function fetchStats() {
    try {
      const res = await fetch(`/api/comments/stats?courseId=${courseId}`)
      const data = await res.json()
      if (data.ok) setAvg(data)
    } catch (_) {
      console.error('fetchStats 실패')
    }
  }

  // =============================
  // ⭐ 댓글 불러오기
  // =============================
  async function fetchComments(reset = false) {
    try {
      const targetPage = reset ? 1 : page

      const res = await fetch(
        `/api/comments/query?courseId=${courseId}&sort=${sort}&page=${targetPage}`
      )
      const data = await res.json()

      if (reset) {
        // 완전 초기화
        setComments(data.comments)
        setHasMore(data.hasMore)
        setPage(1)
      } else {
        // 더보기 시 중복 제거
        setComments((prev) => {
          const map = new Map<string, CommentType>()
          prev.forEach((c) => map.set(c._id, c))
          data.comments.forEach((c: any) => map.set(c._id, c))
          return Array.from(map.values())
        })
        setHasMore(data.hasMore)
      }
    } catch (_) {
      console.error('fetchComments 실패')
    }
  }

  // 정렬 변경 시
  useEffect(() => {
    fetchComments(true)
    fetchStats()
  }, [sort])

  // =============================
  // ⭐ 댓글 작성
  // =============================
  async function submitComment({
    content,
    contentRate,
    homeworkRate,
    examRate,
  }: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
  }) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        content,
        contentRate,
        homeworkRate,
        examRate,
      }),
    })

    const data = await res.json()
    if (!data.ok) {
      alert('댓글 작성 실패: ' + data.error)
      return
    }

    // 작성 후 목록 초기화 + 평균 별점 재계산
    await fetchStats()
    await fetchComments(true)
  }

  // =============================
  // ⭐ 좋아요
  // =============================
  async function toggleLike(id: string) {
    const res = await fetch('/api/comments/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId: id }),
    })

    const data = await res.json()

    if (data.ok) {
      // 좋아요 반영
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, likes: data.likes } : c))
      )
    }
  }

  // =============================
  // ⭐ 삭제
  // =============================
  async function removeComment(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const res = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (data.ok) {
      fetchStats()
      fetchComments(true)
    }
  }

  // =============================
  // ⭐ 수정 상태
  // =============================
  const [editId, setEditId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editContentRate, setEditContentRate] = useState(5)
  const [editHomeworkRate, setEditHomeworkRate] = useState(5)
  const [editExamRate, setEditExamRate] = useState(5)

  function startEdit(c: CommentType) {
    setEditId(c._id)
    setEditContent(c.content)
    setEditContentRate(c.contentRate)
    setEditHomeworkRate(c.homeworkRate)
    setEditExamRate(c.examRate)
  }

  async function saveEdit() {
    if (!editId) return

    const res = await fetch(`/api/comments/${editId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: editContent,
        contentRate: editContentRate,
        homeworkRate: editHomeworkRate,
        examRate: editExamRate,
      }),
    })

    const data = await res.json()
    if (data.ok) {
      setEditId(null)
      fetchStats()
      fetchComments(true)
    }
  }

  // =============================
  // ⭐ 렌더링
  // =============================
  return (
    <div className="mt-10">
      {/* 평균 별점 */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <p className="text-lg font-bold">⭐ 평균 별점 ({avg.total}명)</p>
        <p className="text-sm mt-1">
          내용 {avg.avgContent.toFixed(1)} / 숙제 {avg.avgHomework.toFixed(1)} /
          시험 {avg.avgExam.toFixed(1)}
        </p>
      </div>

      {/* 댓글 작성 */}
      <CommentEditor onSubmit={submitComment} />

      {/* 정렬 버튼 */}
      <div className="flex gap-4 mb-4">
        <button
          className={sort === 'latest' ? 'font-bold' : ''}
          onClick={() => setSort('latest')}
        >
          최신순
        </button>
        <button
          className={sort === 'like' ? 'font-bold' : ''}
          onClick={() => setSort('like')}
        >
          추천순
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="border p-3 rounded bg-white">
            {editId === c._id ? (
              <div>
                <textarea
                  aria-label="댓글 목록"
                  className="w-full border p-2 rounded mb-2"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />

                <div className="flex gap-8 mb-3">
                  <div>
                    <p className="text-sm mb-1">내용</p>
                    <StarRatingInput
                      value={editContentRate}
                      onChange={setEditContentRate}
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-1">숙제</p>
                    <StarRatingInput
                      value={editHomeworkRate}
                      onChange={setEditHomeworkRate}
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-1">시험</p>
                    <StarRatingInput
                      value={editExamRate}
                      onChange={setEditExamRate}
                    />
                  </div>
                </div>

                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  취소
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-1 whitespace-pre-line">{c.content}</p>
                <p className="text-xs text-gray-500 mb-2">
                  ⭐ 내용 {c.contentRate} / 숙제 {c.homeworkRate} / 시험{' '}
                  {c.examRate}
                </p>

                <button
                  onClick={() => toggleLike(c._id)}
                  className="text-sm text-red-500 mr-4"
                >
                  ❤️ {c.likes}
                </button>

                {user?.id === c.user && (
                  <>
                    <button
                      onClick={() => startEdit(c)}
                      className="text-sm text-blue-600 mr-2"
                    >
                      ✏️ 수정
                    </button>
                    <button
                      onClick={() => removeComment(c._id)}
                      className="text-sm text-gray-600"
                    >
                      🗑 삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 더보기 */}
      {hasMore && (
        <button
          className="mt-4 w-full border p-2 rounded"
          onClick={() => {
            setPage(page + 1)
            fetchComments()
          }}
        >
          더보기
        </button>
      )}
    </div>
  )
}

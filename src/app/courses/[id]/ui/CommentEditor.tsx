'use client'

import { useState } from 'react'
import StarRatingInput from './StarRatingInput'

interface Props {
  onSubmit: (data: {
    content: string
    contentRate: number
    homeworkRate: number
    examRate: number
  }) => void
}

export default function CommentEditor({ onSubmit }: Props) {
  const [content, setContent] = useState('')
  const [contentRate, setContentRate] = useState(5)
  const [homeworkRate, setHomeworkRate] = useState(5)
  const [examRate, setExamRate] = useState(5)

  function handleSubmit() {
    if (!content.trim()) return

    onSubmit({
      content,
      contentRate,
      homeworkRate,
      examRate,
    })

    setContent('')
    setContentRate(5)
    setHomeworkRate(5)
    setExamRate(5)
  }

  return (
    <div className="border p-4 rounded bg-white mb-8">
      {/* 댓글 입력 */}
      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={3}
        placeholder="댓글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
      />

      {/* ⭐ 별점 3종 세트 */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <p className="text-sm mb-2">내용</p>
          <StarRatingInput value={contentRate} onChange={setContentRate} />
        </div>

        <div>
          <p className="text-sm mb-2">숙제</p>
          <StarRatingInput value={homeworkRate} onChange={setHomeworkRate} />
        </div>

        <div>
          <p className="text-sm mb-2">시험</p>
          <StarRatingInput value={examRate} onChange={setExamRate} />
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="bg-sky-500 text-white px-4 py-2 rounded"
      >
        작성
      </button>
    </div>
  )
}

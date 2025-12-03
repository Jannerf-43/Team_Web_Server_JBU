'use client'

import RatingStars from './RatingStars'

export default function CommentCard({
  comment,
  userId,
  onLike,
  onEdit,
  onDelete,
}: any) {
  const isOwner = userId === comment.user

  return (
    <div className="py-3 border-b last:border-none">
      <p className="text-sm whitespace-pre-line">{comment.content}</p>

      <RatingStars
        contentRate={comment.contentRate}
        homeworkRate={comment.homeworkRate}
        examRate={comment.examRate}
      />

      <div className="flex items-center gap-4 mt-2 text-sm">
        <button onClick={onLike} className="text-sky-600 hover:text-sky-800">
          ❤️ {comment.likes}
        </button>

        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              수정
            </button>
            <button
              onClick={onDelete}
              className="text-gray-500 hover:text-gray-700"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  )
}

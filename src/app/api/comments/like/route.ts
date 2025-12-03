// src/app/api/comments/like/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getAuth(req)
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: '로그인 필요' },
        { status: 401 }
      )
    }

    const { commentId } = await req.json()

    await connectMongoDB()

    const comment = await Comment.findById(commentId)
    if (!comment) throw new Error('댓글 없음')

    const isLiked = comment.likedUsers.includes(userId)

    if (isLiked) {
      comment.likedUsers = comment.likedUsers.filter(
        (id: string) => id !== userId
      )
      comment.likes -= 1
    } else {
      comment.likedUsers.push(userId)
      comment.likes += 1
    }
    await comment.save()

    return NextResponse.json({ ok: true, likes: comment.likes })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

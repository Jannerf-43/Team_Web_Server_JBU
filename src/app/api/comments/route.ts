// src/app/api/comments/route.ts
import { NextResponse, NextRequest } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getAuth(req)
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { courseId, content, contentRate, homeworkRate, examRate } =
      await req.json()

    if (!courseId || !content) {
      return NextResponse.json(
        { ok: false, error: '필드 누락' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    await Comment.create({
      user: userId,
      course: courseId,
      content,
      contentRate,
      homeworkRate,
      examRate,
      likes: 0,
      likedUsers: [],
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('댓글 등록 오류:', e)
    return NextResponse.json(
      { ok: false, error: '서버 내부 오류' },
      { status: 500 }
    )
  }
}

// src/app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuth(req)
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: '로그인 필요' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const { content, contentRate, homeworkRate, examRate } = await req.json()

    await connectMongoDB()
    const comment = await Comment.findById(id)
    if (!comment) throw new Error('댓글을 찾을 수 없습니다')

    if (comment.user !== userId) {
      return NextResponse.json(
        { ok: false, error: '권한 없음' },
        { status: 403 }
      )
    }

    comment.content = content
    comment.contentRate = contentRate
    comment.homeworkRate = homeworkRate
    comment.examRate = examRate

    await comment.save()

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuth(req)
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: '로그인 필요' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    await connectMongoDB()

    const comment = await Comment.findById(id)
    if (!comment) throw new Error('댓글 없음')

    if (comment.user !== userId) {
      return NextResponse.json(
        { ok: false, error: '권한 없음' },
        { status: 403 }
      )
    }

    await Comment.findByIdAndDelete(id)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

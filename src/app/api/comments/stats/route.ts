import { NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const courseId = url.searchParams.get('courseId')

    await connectMongoDB()

    const comments = await Comment.find({ course: courseId })

    if (comments.length === 0)
      return NextResponse.json({
        ok: true,
        avgContent: 0,
        avgHomework: 0,
        avgExam: 0,
        total: 0,
      })

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

    const avgContent =
      sum(comments.map((c) => c.contentRate || 0)) / comments.length
    const avgHomework =
      sum(comments.map((c) => c.homeworkRate || 0)) / comments.length
    const avgExam = sum(comments.map((c) => c.examRate || 0)) / comments.length

    return NextResponse.json({
      ok: true,
      avgContent,
      avgHomework,
      avgExam,
      total: comments.length,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}

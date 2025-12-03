// src/app/api/comments/query/route.ts
import { NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Comment from '@/models/comment'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const courseId = url.searchParams.get('courseId')
    const sort = url.searchParams.get('sort') || 'latest'
    const page = Number(url.searchParams.get('page') || 1)

    const pageSize = 5

    await connectMongoDB()

    const sortOption =
      sort === 'like' ? { likes: -1, createdAt: -1 } : { createdAt: -1 }

    const comments = await Comment.find({ course: courseId })
      .sort(sortOption as any)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const total = await Comment.countDocuments({ course: courseId })

    return NextResponse.json({
      ok: true,
      comments,
      hasMore: page * pageSize < total,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

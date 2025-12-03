'use client'

export default function SortTabs({ sort, setSort }: any) {
  return (
    <div className="flex gap-6 mb-4 text-sm border-b pb-2">
      <button
        onClick={() => setSort('latest')}
        className={
          sort === 'latest'
            ? 'font-bold text-sky-600'
            : 'text-gray-500 hover:text-sky-500'
        }
      >
        최신순
      </button>

      <button
        onClick={() => setSort('like')}
        className={
          sort === 'like'
            ? 'font-bold text-sky-600'
            : 'text-gray-500 hover:text-sky-500'
        }
      >
        추천순
      </button>
    </div>
  )
}

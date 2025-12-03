export default function RatingStars({
  contentRate,
  homeworkRate,
  examRate,
}: any) {
  return (
    <div className="text-[11px] text-gray-500">
      ⭐ {contentRate} / 숙제 {homeworkRate} / 시험 {examRate}
    </div>
  )
}

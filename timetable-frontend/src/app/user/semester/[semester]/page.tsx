import { UserTimetablePage } from "./UserTimetablePage"

export default function SemesterPage({ params }: { params: { semester: string } }) {
  const semesterNumber = parseInt(params.semester, 10)

  return <UserTimetablePage semesterNumber={semesterNumber} />
}
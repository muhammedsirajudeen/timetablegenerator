"use client";

import { useParams } from "next/navigation";
import { UserTimetablePage } from "./UserTimetablePage";


export default function SemesterPage() {
  const params = useParams();
  
  const semester = Number(params.semester);

  if (isNaN(semester)) return <p>Invalid Semester</p>;

  return <UserTimetablePage semesterNumber={semester} />
}
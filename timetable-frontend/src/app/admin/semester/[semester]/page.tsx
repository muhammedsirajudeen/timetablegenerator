"use client";

import { useParams } from "next/navigation";
import { SemesterTimetablePage } from "@/components/semester-timetable-page";

export default function SemesterTimetable() {
  const params = useParams();
  
  const semester = Number(params.semester);

  if (isNaN(semester)) return <p>Invalid Semester</p>;

  return <SemesterTimetablePage semesterNumber={semester} />;
}

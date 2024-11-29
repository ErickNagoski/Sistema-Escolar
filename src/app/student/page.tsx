"use client"
import GradesTable from "@/components/GradesTable";
import { StudentsTable } from "@/components/StudentsTable";
import { useAuth } from "@/hooks/useAuthMe";

export default function StudentHome() {
  const { authData } = useAuth();



  return <GradesTable matricula={authData?.user?.matricula as string} filter="" />
}
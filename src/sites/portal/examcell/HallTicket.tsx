import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { examinationService } from "@/features/examinations/examinationService";
import { studentService } from "@/features/students/studentService";
import { institutionService } from "@/features/institutions/institutionService";
import { queryKeys } from "@/lib/queryKeys";

export default function HallTicket() {
  const { examId, studentId } = useParams<{ examId: string; studentId: string }>();

  const { data: exam, isLoading: loadingExam } = useQuery({ queryKey: queryKeys.examination(examId ?? ""), queryFn: () => examinationService.get(examId!), enabled: !!examId });
  const { data: student, isLoading: loadingStudent } = useQuery({ queryKey: queryKeys.student(studentId ?? ""), queryFn: () => studentService.get(studentId!), enabled: !!studentId });
  const { data: institution } = useQuery({ queryKey: queryKeys.institution("college"), queryFn: () => institutionService.get("college") });

  if (loadingExam || loadingStudent) return <PageLoadingSkeleton />;
  if (!exam || !student) return <EmptyState title="Hall ticket data not found" />;

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-2xl justify-end print:hidden">
        <Button onClick={() => window.print()} className="gap-1.5">
          <Printer className="size-4" /> Print
        </Button>
      </div>

      <div className="border-border bg-surface mx-auto max-w-2xl rounded-lg border p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="border-border mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <p className="font-heading text-foreground text-lg font-bold">{institution?.name}</p>
            <p className="text-muted-foreground text-xs">{institution?.affiliation}</p>
          </div>
          <p className="border-border rounded-md border px-3 py-1 text-sm font-semibold">HALL TICKET</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <AvatarInitials name={student.name} size="xl" />
          <div>
            <p className="text-foreground text-xl font-semibold">{student.name}</p>
            <p className="text-muted-foreground text-sm">
              {student.admissionNo} · Roll {student.rollNumber}
            </p>
            <p className="text-muted-foreground text-sm">{student.classOrProgrammeName} — {student.section}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Examination</p>
            <p className="font-medium">{exam.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Term / Academic Year</p>
            <p className="font-medium">
              {exam.term} · {exam.academicYear}
            </p>
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-border border-y">
              <th className="p-2 text-left font-medium">Subject</th>
              <th className="p-2 text-left font-medium">Date</th>
              <th className="p-2 text-right font-medium">Max Marks</th>
            </tr>
          </thead>
          <tbody>
            {exam.subjects.map((s) => (
              <tr key={s.subject} className="border-border border-b">
                <td className="p-2">{s.subject}</td>
                <td className="p-2">{s.examDate}</td>
                <td className="p-2 text-right">{s.maxMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-muted-foreground mt-6 text-xs">
          Candidates must carry this hall ticket along with a valid photo ID to every examination session. This is a
          system-generated document and does not require a signature.
        </p>
      </div>
    </div>
  );
}

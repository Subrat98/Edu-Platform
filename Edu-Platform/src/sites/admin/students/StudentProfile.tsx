import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarInitials } from "@/components/common/AvatarInitials";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { studentService } from "@/features/students/studentService";
import { queryKeys } from "@/lib/queryKeys";

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading } = useQuery({ queryKey: queryKeys.student(id ?? ""), queryFn: () => studentService.get(id!), enabled: !!id });
  const { data: guardian } = useQuery({ queryKey: queryKeys.guardian(student?.guardianId ?? ""), queryFn: () => studentService.getGuardian(student!.guardianId), enabled: !!student });
  const { data: attendance } = useQuery({ queryKey: queryKeys.studentAttendance(id ?? ""), queryFn: () => studentService.getAttendanceSummary(id!), enabled: !!id });
  const { data: results } = useQuery({ queryKey: queryKeys.studentResults(id ?? ""), queryFn: () => studentService.getResultsSummary(id!), enabled: !!id });
  const { data: invoices } = useQuery({ queryKey: queryKeys.studentFees(id ?? ""), queryFn: () => studentService.getFeeLedger(id!), enabled: !!id });

  if (isLoading) return <PageLoadingSkeleton />;
  if (!student) return <EmptyState title="Student not found" />;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/admin/students">
          <ArrowLeft className="size-4" /> Back to directory
        </Link>
      </Button>

      <div className="mb-6 flex items-center gap-4">
        <AvatarInitials name={student.name} size="xl" />
        <div>
          <h1 className="font-heading text-foreground text-2xl font-semibold">{student.name}</h1>
          <p className="text-muted-foreground text-sm">
            {student.admissionNo} · {student.classOrProgrammeName} ({student.section}) · Roll {student.rollNumber}
          </p>
          <Badge variant="outline" className="mt-1">
            {student.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guardian">Guardian</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-xs">Gender</p>
                <p className="text-sm font-medium">{student.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Date of Birth</p>
                <p className="text-sm font-medium">{student.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Admission Date</p>
                <p className="text-sm font-medium">{student.admissionDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Class / Programme</p>
                <p className="text-sm font-medium">{student.classOrProgrammeName}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardian" className="mt-4">
          <Card>
            <CardContent className="space-y-3 pt-6 text-sm">
              {guardian ? (
                <>
                  <div className="flex items-center gap-2 font-medium">
                    <AvatarInitials name={guardian.name} size="sm" /> {guardian.name}
                    <Badge variant="outline">{guardian.relationship}</Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="size-3.5" /> {guardian.phone}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="size-3.5" /> {guardian.email}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="size-3.5" /> {guardian.occupation}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">No guardian on record.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance — last {attendance?.total ?? 0} sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4 text-3xl font-bold">
                {attendance?.percentage ?? 0}%{" "}
                <span className="text-muted-foreground text-sm font-normal">present</span>
              </p>
              <ul className="divide-border divide-y">
                {(attendance?.recent ?? []).map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-muted-foreground">{r.date}</span>
                    <Badge variant="outline">{r.status}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {!results || results.length === 0 ? (
                <p className="text-muted-foreground text-sm">No published results yet.</p>
              ) : (
                <ul className="divide-border divide-y">
                  {results.map((m) => (
                    <li key={m.id} className="flex items-center justify-between py-2 text-sm">
                      <span>{m.subject}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {m.marksObtained}/{m.maxMarks}
                        </span>
                        <Badge variant="outline">{m.grade}</Badge>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {!invoices || invoices.length === 0 ? (
                <p className="text-muted-foreground text-sm">No invoices on record.</p>
              ) : (
                <ul className="divide-border divide-y">
                  {invoices.map((inv) => (
                    <li key={inv.id} className="flex items-center justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium">{inv.description}</p>
                        <p className="text-muted-foreground text-xs">
                          ₹{inv.amountPaid} of ₹{inv.amount - inv.concession} paid
                        </p>
                      </div>
                      <Badge variant="outline">{inv.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

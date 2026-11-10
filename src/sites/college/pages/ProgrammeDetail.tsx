import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, IndianRupee, Users, BookOpen, Award, FileText, Calendar } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { FacultyGrid } from "@/components/sections/FacultyGrid";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { collegeHeroUrl } from "@/mocks/data/images";
import { academicService } from "@/features/academics/academicService";
import { queryKeys } from "@/lib/queryKeys";
import { departments } from "@/mocks/data/departments";
import { collegeStaff } from "@/mocks/data/staff";

export default function CollegeProgrammeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: programme, isLoading } = useQuery({
    queryKey: queryKeys.programme(slug ?? ""),
    queryFn: () => academicService.getProgramme(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageLoadingSkeleton />;

  if (!programme) {
    return (
      <Container className="py-16">
        <EmptyState title="Programme not found" description="This programme page doesn't exist." />
      </Container>
    );
  }

  const department = departments.find((d) => d.id === programme.departmentId);
  const deptFaculty = collegeStaff.filter((s) => s.departmentId === programme.departmentId).slice(0, 4);

  return (
    <>
      <Hero variant="compact" title={programme.name} imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/college" },
          { label: "Programmes & Courses", href: "/college/programmes" },
          { label: programme.name },
        ]}
      />

      <Container className="py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <Clock className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">{programme.durationYears} years</p>
            <p className="text-muted-foreground text-xs">Duration</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <Users className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">{programme.seats}</p>
            <p className="text-muted-foreground text-xs">Seats</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <IndianRupee className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">₹{programme.feePerYear.toLocaleString("en-IN")}</p>
            <p className="text-muted-foreground text-xs">Per year</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-4 text-center">
            <CheckCircle2 className="text-accent mx-auto size-5" />
            <p className="mt-2 text-sm font-semibold">{programme.level}</p>
            <p className="text-muted-foreground text-xs">Level</p>
          </div>
        </div>
        <div className="mt-6">
          <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
            <Link to="/college/admissions">Apply for this programme</Link>
          </Button>
        </div>
      </Container>

      <RichText
        eyebrow={department?.name}
        title="About this programme"
        paragraphs={[programme.description, `Eligibility: ${programme.eligibility}.`]}
      />

      {/* Curriculum Planning & NAAC 1.1.1 Alignment */}
      <Container className="py-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                    NAAC Metric 1.1.1 Aligned
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                    NEP 2020 / LOCF Compliant
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-2">
                  Curriculum Architecture & Learning Delivery
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                  Curriculum designed under Learning Outcomes-based Curriculum Framework (LOCF), reviewed by Board of Studies and ratified in statutory Academic Council.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                  <Link to="/college/iqac">
                    <Award className="size-3.5" />
                    <span>View IQAC Portal</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <BookOpen className="size-4 text-primary" />
                  <span>LOCF Credit Framework</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choice Based Credit System (CBCS) with interdisciplinary electives, skill enhancement, and industry project credits.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Calendar className="size-4 text-emerald-600" />
                  <span>Academic Calendar Guarantee</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Guaranteed ≥90 instructional days per semester with centralized Continuous Internal Evaluation (CIE) windows.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <FileText className="size-4 text-purple-600" />
                  <span>Council Resolution</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Statutory gazette notification ACM/XXXIV/2026. Course Outcomes (CO) 100% mapped to Bloom's Taxonomy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      {deptFaculty.length > 0 ? (
        <FacultyGrid
          eyebrow="Taught by"
          title={`${department?.name} Faculty`}
          institutionId="college"
          items={deptFaculty.map((f) => ({ name: f.name, role: f.designation, meta: f.qualification }))}
        />
      ) : null}

      <Downloads institutionId="college" title="Syllabus & Semester Structure" category="Academics" />
    </>
  );
}

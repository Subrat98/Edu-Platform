import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { Downloads } from "@/components/sections/Downloads";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { collegeHeroUrl } from "@/mocks/data/images";

const committees = [
  { name: "Governing Body", chair: "Dr. Himansu Sekhar Das (Principal)", meets: "Twice a year" },
  { name: "IQAC", chair: "Dr. Snigdha Mohanty (Coordinator)", meets: "Quarterly" },
  { name: "Grievance Redressal Committee", chair: "Dr. Rashmita Mishra", meets: "As required" },
  { name: "Anti-Ragging Committee", chair: "Prof. Satyabrata Dash", meets: "Each semester" },
  { name: "Women's Cell", chair: "Dr. Minati Behera", meets: "Quarterly" },
];

export default function CollegeDisclosure() {
  return (
    <>
      <Hero variant="compact" title="Mandatory Disclosure" imageUrl={collegeHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Mandatory Disclosure" }]} />

      <RichText
        eyebrow="Compliance"
        title="Statutory information"
        paragraphs={[
          "As required by UGC and affiliating-university norms, the college publishes its statutory approvals, governing committees, audited financial statements and RTI information for public access.",
        ]}
      />

      <section className="bg-surface">
        <Container className="py-14 sm:py-16">
          <SectionHeading eyebrow="Governance" title="Statutory Committees" />
          <div className="border-border mt-6 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Committee</th>
                  <th className="px-4 py-3 font-medium">Chair / Coordinator</th>
                  <th className="px-4 py-3 font-medium">Meets</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {committees.map((c) => (
                  <tr key={c.name}>
                    <td className="text-foreground px-4 py-3 font-medium">{c.name}</td>
                    <td className="text-muted-foreground px-4 py-3">{c.chair}</td>
                    <td className="text-muted-foreground px-4 py-3">{c.meets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <Downloads institutionId="college" title="Statutory Documents, RTI & Audited Statements" category="Compliance" />
    </>
  );
}

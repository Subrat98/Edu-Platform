import { useParams } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";
import { Container } from "@/components/common/Container";
import { schoolHeroUrl } from "@/mocks/data/images";
import { getPolicyPage } from "@/mocks/data/policies";

export default function SchoolPolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const policy = slug ? getPolicyPage("school", slug) : undefined;

  if (!policy) {
    return (
      <Container className="py-16">
        <EmptyState title="Policy not found" description="This policy page doesn't exist yet." />
      </Container>
    );
  }

  return (
    <>
      <Hero variant="compact" title={policy.title} imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: policy.title }]} />
      <RichText
        title={`Last updated: ${new Date(policy.updatedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
        paragraphs={policy.paragraphs}
      />
    </>
  );
}

import { Hero } from "@/components/sections/Hero";
import { LibraryWidget } from "@/components/sections/LibraryWidget";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { collegeHeroUrl } from "@/mocks/data/images";

export default function CollegeLibraryPublic() {
  return (
    <>
      <Hero variant="compact" title="Central Library" imageUrl={collegeHeroUrl(3)} />
      <Breadcrumbs items={[{ label: "Home", href: "/college" }, { label: "Library" }]} />

      <LibraryWidget
        volumeCount="60,000+"
        hours="9:00 AM – 6:00 PM, Monday–Saturday (extended hours during examinations)"
        catalogueHref="/college/library"
        loginHref="/auth/login"
      />

      <RichText
        eyebrow="Resources"
        title="E-resources & digital library"
        paragraphs={[
          "Beyond its physical collection, the library subscribes to journal databases and e-book collections accessible to registered students and faculty from the campus network.",
          "Students, faculty and research scholars have differentiated loan limits and periods based on membership type.",
          "Catalogue search, online booking and the Booking Number verification workflow at the circulation desk will be available once the Library module goes live in a later phase of this build.",
        ]}
      />
    </>
  );
}

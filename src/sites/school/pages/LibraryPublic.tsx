import { Hero } from "@/components/sections/Hero";
import { LibraryWidget } from "@/components/sections/LibraryWidget";
import { RichText } from "@/components/sections/RichText";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { schoolHeroUrl } from "@/mocks/data/images";

export default function SchoolLibraryPublic() {
  return (
    <>
      <Hero variant="compact" title="School Library" imageUrl={schoolHeroUrl(1)} />
      <Breadcrumbs items={[{ label: "Home", href: "/school" }, { label: "Library" }]} />

      <LibraryWidget
        volumeCount="12,000+"
        hours="8:00 AM – 4:00 PM, Monday–Saturday"
        catalogueHref="/school/library"
        loginHref="/auth/login"
      />

      <RichText
        eyebrow="Rules"
        title="Borrowing rules & timings"
        paragraphs={[
          "Students from Class III onward may borrow up to two books at a time for a 14-day loan period, renewable once if no reservation is pending.",
          "Reference and rare books are marked 'Library Use Only' and may be read in the library but not issued out.",
          "Catalogue search, online booking and renewal through the student portal will be available once the Library module goes live in a later phase of this build.",
        ]}
      />
    </>
  );
}

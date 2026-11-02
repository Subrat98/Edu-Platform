import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/common/Container";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";
import { useQuery } from "@tanstack/react-query";
import { navMenuService } from "@/features/content/navMenuService";
import { queryKeys } from "@/lib/queryKeys";

// lucide-react no longer ships brand/logo icons (trademark reasons), so
// every social link uses a neutral globe icon with a platform aria-label.
const SOCIAL_PLATFORMS = ["facebook", "youtube", "instagram", "linkedin", "twitter"] as const;
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { institutionId, institution } = useInstitutionData();
  const { data: menu } = useQuery({
    queryKey: queryKeys.navMenu(institutionId),
    queryFn: () => navMenuService.get(institutionId),
  });

  return (
    <footer className="bg-primary text-white">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-heading text-lg font-semibold">{institution?.name}</span>
          <p className="mt-3 max-w-xs text-sm text-white/75">{institution?.description}</p>
          <div className="mt-4 flex gap-3">
            {institution &&
              SOCIAL_PLATFORMS.map((key) => {
                const href = institution.socials[key];
                if (!href) return null;
                return (
                  <a
                    key={key}
                    href={href}
                    className="flex size-8 items-center justify-center rounded-full bg-white/10 capitalize hover:bg-white/20"
                    aria-label={key}
                    title={key}
                  >
                    <Globe className="size-4" />
                  </a>
                );
              })}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-white/60 uppercase">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(menu?.footerQuickLinks ?? []).map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-white/80 hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-white/60 uppercase">Contact</p>
          <ul className="mt-3 space-y-3 text-sm text-white/80">
            {institution ? (
              <>
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>
                    {institution.contact.address}, {institution.contact.city}, {institution.contact.state} —{" "}
                    {institution.contact.pincode}
                  </span>
                </li>
                <li className="flex gap-2">
                  <Phone className="size-4 shrink-0" /> {institution.contact.phone}
                </li>
                <li className="flex gap-2">
                  <Mail className="size-4 shrink-0" /> {institution.contact.email}
                </li>
              </>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-white/60 uppercase">Policies</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(menu?.footerPolicyLinks ?? []).map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-white/80 hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <span>
            © {CURRENT_YEAR} {institution?.name}. All rights reserved.
          </span>
          <span>Built on EduPlatform · Demo data for illustration only</span>
        </Container>
      </div>
    </footer>
  );
}

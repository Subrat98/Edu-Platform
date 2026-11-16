import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  BottomTabBar,
  schoolPublicTabs,
  collegePublicTabs,
} from "@/components/layout/BottomTabBar";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { InstallPrompt } from "@/features/pwa/InstallPrompt";
import { useInstitutionStore } from "@/features/institutions/institutionStore";

export function PublicLayout() {
  const location = useLocation();
  const activeInstitutionId = useInstitutionStore(
    (s) => s.activeInstitutionId,
  );
  const setInstitution = useInstitutionStore((s) => s.setInstitution);
  const visibility = useInstitutionStore((s) => s.visibility);

  // Synchronize active institution with current route prefix (only if visible)
  useEffect(() => {
    if (location.pathname.startsWith("/college") && activeInstitutionId !== "college" && (visibility?.college ?? true)) {
      setInstitution("college");
    } else if (location.pathname.startsWith("/school") && activeInstitutionId !== "school" && (visibility?.school ?? true)) {
      setInstitution("school");
    }
  }, [location.pathname, activeInstitutionId, setInstitution, visibility]);
  const tabs =
    activeInstitutionId === "college" ? collegePublicTabs : schoolPublicTabs;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* pb-16 on mobile so content clears the fixed bottom tab bar */}
      <main className="flex-1 pb-16 xl:pb-0">
        <Suspense fallback={<PageLoadingSkeleton />} key={location.pathname}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <BottomTabBar tabs={tabs} />
      <InstallPrompt />
    </div>
  );
}

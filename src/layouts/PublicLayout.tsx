import { Suspense } from "react";
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

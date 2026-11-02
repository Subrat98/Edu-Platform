import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";

export function PublicLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingSkeleton />} key={location.pathname}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

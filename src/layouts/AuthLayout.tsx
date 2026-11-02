import { Outlet } from "react-router-dom";
import { Container } from "@/components/common/Container";

export function AuthLayout() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center py-12">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

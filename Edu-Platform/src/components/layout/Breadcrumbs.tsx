import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Container } from "@/components/common/Container";

export interface BreadcrumbTrailItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbTrailItem[] }) {
  return (
    <div className="bg-background border-border border-b">
      <Container className="py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              return (
                <span key={item.label} className="contents">
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </div>
  );
}

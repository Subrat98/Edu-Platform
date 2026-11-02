import { useQuery } from "@tanstack/react-query";
import { PageRenderer } from "@/features/cms/PageRenderer";
import { pageService } from "@/features/cms/pageService";
import { PageLoadingSkeleton } from "@/components/common/PageLoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { queryKeys } from "@/lib/queryKeys";

export default function SchoolHome() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.page("school", "home"),
    queryFn: () => pageService.getHome("school"),
  });

  if (isLoading) return <PageLoadingSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;
  return <PageRenderer page={data} />;
}

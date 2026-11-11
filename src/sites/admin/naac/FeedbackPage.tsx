import { StakeholderFeedbackConsole } from "./StakeholderFeedbackConsole";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeedbackPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Link to="/admin/naac/criteria?tab=1">
              <ArrowLeft className="size-3.5" />
              <span>Back to Criterion 1</span>
            </Link>
          </Button>
          <span className="text-muted-foreground text-xs">/</span>
          <span className="text-xs font-semibold text-foreground">Stakeholder Feedback & ATRs (1.4.1)</span>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link to="/admin/naac">
              <Award className="size-3.5 text-primary" />
              <span>NAAC Dashboard</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <a href="/college/iqac" target="_blank" rel="noreferrer">
              <Globe className="size-3.5 text-emerald-600" />
              <span>Public Website ATR</span>
            </a>
          </Button>
        </div>
      </div>

      <StakeholderFeedbackConsole />
    </div>
  );
}

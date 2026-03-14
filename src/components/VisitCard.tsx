import { Link } from "react-router-dom";
import { ChevronRight, CalendarDays } from "lucide-react";
import type { Visit } from "../types/database";

interface VisitCardProps {
  visit: Visit;
  patientId: string;
}

export default function VisitCard({ visit, patientId }: VisitCardProps) {
  return (
    <Link
      to={`/patients/${patientId}/visits/${visit.id}`}
      className="block bg-white rounded-lg border border-gray-200 px-4 py-3 min-h-[44px] cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text">
            Visit #{visit.visit_number}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
            <CalendarDays className="w-4 h-4" />
            <span>{visit.visit_date || "No date"}</span>
          </div>
          {visit.complaint && (
            <p className="text-sm text-text-muted mt-1 truncate">
              {visit.complaint}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-text-muted/40 shrink-0" />
      </div>
    </Link>
  );
}

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { PatientWithVisitCount } from "../types/database";

interface PatientCardProps {
  patient: PatientWithVisitCount;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const visitCount = patient.visits?.[0]?.count ?? 0;

  return (
    <Link
      to={`/patients/${patient.id}`}
      className="block bg-white rounded-lg border border-gray-200 px-4 py-3 min-h-[44px] cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text truncate">{patient.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
            {patient.age != null && <span>Age {patient.age}</span>}
            <span>{patient.referred_from}</span>
            <span>
              {visitCount} {visitCount === 1 ? "visit" : "visits"}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-text-muted/40 shrink-0" />
      </div>
    </Link>
  );
}

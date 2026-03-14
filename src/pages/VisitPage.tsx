import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import VisitSheet from "../components/VisitSheet";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Visit } from "../types/database";

export default function VisitPage() {
  const { id: patientId, visitId } = useParams<{
    id: string;
    visitId: string;
  }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVisit() {
      if (!visitId) return;
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("id", visitId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setVisit(data as Visit);
      }
      setLoading(false);
    }
    fetchVisit();
  }, [visitId]);

  async function handleSave(formData: Partial<Visit>) {
    if (!visitId) return;
    const { data, error } = await supabase
      .from("visits")
      .update(formData)
      .eq("id", visitId)
      .select()
      .single();

    if (error) {
      setError(error.message);
      throw error;
    }

    setVisit(data as Visit);
  }

  const isNewVisit =
    visit && !visit.complaint && !visit.diagnosis && !visit.treatment;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <button
          onClick={() => navigate(`/patients/${patientId}`)}
          className="inline-flex items-center gap-1 text-text-muted hover:text-text min-h-[44px] cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Patient
        </button>

        {error && (
          <div
            className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {visit ? (
          <VisitSheet
            visit={visit}
            onSave={handleSave}
            initialEditing={!!isNewVisit}
          />
        ) : (
          <p className="text-danger">Visit not found.</p>
        )}
      </main>
    </div>
  );
}

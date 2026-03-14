import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Visit } from "../types/database";

export function useVisits(patientId: string | undefined) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .eq("patient_id", patientId)
      .order("visit_number", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setVisits(data as Visit[]);
    }

    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  return { visits, loading, error, refetch: fetchVisits };
}

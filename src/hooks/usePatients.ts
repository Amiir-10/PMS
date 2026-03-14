import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { PatientWithVisitCount } from "../types/database";

export function usePatients() {
  const [patients, setPatients] = useState<PatientWithVisitCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("patients")
      .select("*, visits(count)")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPatients(data as PatientWithVisitCount[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
}

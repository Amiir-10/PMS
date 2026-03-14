import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useVisits } from "../hooks/useVisits";
import Navbar from "../components/Navbar";
import VisitCard from "../components/VisitCard";
import { ArrowLeft, Plus, Loader2, Pencil, Check, X, Trash2 } from "lucide-react";
import type { Patient } from "../types/database";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    visits,
    loading: visitsLoading,
    error: visitsError,
    refetch: refetchVisits,
  } = useVisits(id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingVisit, setAddingVisit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      if (!id) return;
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPatient(data as Patient);
        setEditName(data.name);
        setEditAge(data.age?.toString() ?? "");
        setEditAddress(data.address ?? "");
      }
      setLoading(false);
    }
    fetchPatient();
  }, [id]);

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("patients")
      .update({
        name: editName,
        age: editAge ? parseInt(editAge, 10) : null,
        address: editAddress || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setPatient(data as Patient);
      setEditing(false);
    }
    setSaving(false);
  }

  function handleCancelEdit() {
    if (!patient) return;
    setEditName(patient.name);
    setEditAge(patient.age?.toString() ?? "");
    setEditAddress(patient.address ?? "");
    setEditing(false);
  }

  async function handleAddVisit() {
    if (!id) return;
    setAddingVisit(true);

    const nextNumber = visits.length + 1;
    const { data: visit, error } = await supabase
      .from("visits")
      .insert({ patient_id: id, visit_number: nextNumber })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setAddingVisit(false);
      return;
    }

    navigate(`/patients/${id}/visits/${visit.id}`);
  }

  async function handleDeletePatient() {
    if (!id) return;
    if (!window.confirm("Delete this patient and all their visits?")) return;
    setDeleting(true);

    const { error: visitsErr } = await supabase
      .from("visits")
      .delete()
      .eq("patient_id", id);

    if (visitsErr) {
      setError(visitsErr.message);
      setDeleting(false);
      return;
    }

    const { error: patientErr } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    if (patientErr) {
      setError(patientErr.message);
      setDeleting(false);
      return;
    }

    navigate("/");
  }

  async function handleDeleteVisit(visitId: string) {
    if (!window.confirm("Delete this visit?")) return;

    const { error } = await supabase
      .from("visits")
      .delete()
      .eq("id", visitId);

    if (error) {
      setError(error.message);
      return;
    }

    refetchVisits();
  }

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

  if (!patient) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-6">
          <p className="text-danger">{error || "Patient not found."}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 text-text-muted hover:text-text min-h-[44px] cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {error && (
          <div
            className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <section className="bg-white rounded-lg border border-gray-200 p-4">
          {editing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  maxLength={100}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-age"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Age
                </label>
                <input
                  id="edit-age"
                  type="number"
                  min="0"
                  max="150"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-address"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Address
                </label>
                <textarea
                  id="edit-address"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={2}
                  maxLength={300}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[44px] inline-flex items-center gap-2 bg-cta text-white font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-cta-dark focus:outline-none focus:ring-2 focus:ring-cta/40 transition-colors duration-200 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="min-h-[44px] inline-flex items-center gap-2 bg-gray-100 text-text font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-text font-[family-name:var(--font-heading)]">
                    {patient.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                    {patient.age != null && <span>Age {patient.age}</span>}
                  </div>
                  {patient.address && (
                    <p className="text-sm text-text-muted mt-2">
                      {patient.address}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(true)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-primary cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                    aria-label="Edit patient"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeletePatient}
                    disabled={deleting}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-danger cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-danger/20 rounded-lg disabled:opacity-60"
                    aria-label="Delete patient"
                  >
                    {deleting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text font-[family-name:var(--font-heading)]">
              Visits ({visits.length})
            </h3>
            <button
              onClick={handleAddVisit}
              disabled={addingVisit}
              className="min-h-[44px] inline-flex items-center gap-2 bg-primary text-white font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-60"
            >
              {addingVisit ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              New Visit
            </button>
          </div>

          {visitsError && (
            <div
              className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm"
              role="alert"
            >
              {visitsError}
            </div>
          )}

          {visitsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : visits.length === 0 ? (
            <p className="text-center text-text-muted py-8">
              No visits recorded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {visits.map((visit) => (
                <VisitCard
                  key={visit.id}
                  visit={visit}
                  patientId={id!}
                  onDelete={() => handleDeleteVisit(visit.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

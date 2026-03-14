import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { usePatients } from "../hooks/usePatients";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PatientCard from "../components/PatientCard";
import { Plus, Loader2, X, UserPlus } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients, loading, error, refetch } = usePatients();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text font-[family-name:var(--font-heading)]">
            Patients
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="min-h-[44px] inline-flex items-center gap-2 bg-primary text-white font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Patient</span>
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        {error && (
          <div
            className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
            <p className="text-text-muted">
              {search
                ? "No patients match your search."
                : "No patients yet. Add your first patient."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <AddPatientModal
          onClose={() => setShowForm(false)}
          onCreated={(patientId, visitId) => {
            refetch();
            navigate(`/patients/${patientId}/visits/${visitId}`);
          }}
        />
      )}
    </div>
  );
}

function AddPatientModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (patientId: string, visitId: string) => void;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .insert({
        name,
        age: age ? parseInt(age, 10) : null,
        address: address || null,
      })
      .select()
      .single();

    if (patientError) {
      setError(patientError.message);
      setSaving(false);
      return;
    }

    const { data: visit, error: visitError } = await supabase
      .from("visits")
      .insert({ patient_id: patient.id, visit_number: 1 })
      .select()
      .single();

    if (visitError) {
      setError(visitError.message);
      setSaving(false);
      return;
    }

    onCreated(patient.id, visit.id);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text font-[family-name:var(--font-heading)]">
            New Patient
          </h2>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div
            className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="patient-name"
              className="block text-sm font-medium text-text mb-1"
            >
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="patient-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Patient name"
            />
          </div>

          <div>
            <label
              htmlFor="patient-age"
              className="block text-sm font-medium text-text mb-1"
            >
              Age
            </label>
            <input
              id="patient-age"
              type="number"
              min="0"
              max="150"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Patient age"
            />
          </div>

          <div>
            <label
              htmlFor="patient-address"
              className="block text-sm font-medium text-text mb-1"
            >
              Address
            </label>
            <textarea
              id="patient-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
              placeholder="Patient address"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full min-h-[44px] rounded-lg bg-cta text-white font-semibold py-3 cursor-pointer hover:bg-cta-dark focus:outline-none focus:ring-2 focus:ring-cta/40 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? "Creating..." : "Create Patient & Start Visit"}
          </button>
        </form>
      </div>
    </div>
  );
}

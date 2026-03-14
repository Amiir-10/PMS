import { useState } from "react";
import { Loader2, Pencil, Check, X } from "lucide-react";
import type { Visit } from "../types/database";

interface VisitSheetProps {
  visit: Visit;
  onSave: (data: Partial<Visit>) => Promise<void>;
  initialEditing?: boolean;
}

const SHORT_FIELDS: { key: keyof Visit; label: string }[] = [
  { key: "blood_pressure", label: "Blood Pressure" },
  { key: "o2_saturation", label: "O2 Saturation" },
  { key: "random_blood_sugar", label: "Random Blood Sugar" },
];

const LONG_FIELDS: { key: keyof Visit; label: string }[] = [
  { key: "complaint", label: "Complaint" },
  { key: "chest_and_heart", label: "Chest & Heart" },
  { key: "lower_limb", label: "Lower Limb" },
  { key: "abdomen", label: "Abdomen" },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "lab_results", label: "Lab Results" },
  { key: "treatment", label: "Treatment" },
];

export default function VisitSheet({
  visit,
  onSave,
  initialEditing = false,
}: VisitSheetProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [formData, setFormData] = useState<Partial<Visit>>({ ...visit });
  const [saving, setSaving] = useState(false);

  function updateField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setFormData({ ...visit });
    setIsEditing(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text font-[family-name:var(--font-heading)]">
            Visit #{visit.visit_number}
          </h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="min-h-[44px] inline-flex items-center gap-2 bg-primary text-white font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors duration-200"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
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
              onClick={handleCancel}
              className="min-h-[44px] inline-flex items-center gap-2 bg-gray-100 text-text font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Visit Date
          </label>
          {isEditing ? (
            <input
              type="date"
              value={formData.visit_date ?? ""}
              onChange={(e) => updateField("visit_date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          ) : (
            <p className="text-text">{visit.visit_date || "—"}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SHORT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-text-muted mb-1">
                {label}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  maxLength={50}
                  value={(formData[key] as string) ?? ""}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              ) : (
                <p className="text-text">{(visit[key] as string) || "—"}</p>
              )}
            </div>
          ))}
        </div>

        {LONG_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-text-muted mb-1">
              {label}
            </label>
            {isEditing ? (
              <textarea
                value={(formData[key] as string) ?? ""}
                onChange={(e) => updateField(key, e.target.value)}
                rows={3}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-y min-h-[80px]"
              />
            ) : (
              <p className="text-text whitespace-pre-wrap">
                {(visit[key] as string) || "—"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

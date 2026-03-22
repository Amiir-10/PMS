export interface Patient {
  id: string;
  created_at: string;
  name: string;
  age: number | null;
  address: string | null;
  referred_from: string;
}

export interface Visit {
  id: string;
  created_at: string;
  patient_id: string;
  visit_number: number;
  visit_date: string;
  complaint: string | null;
  blood_pressure: string | null;
  o2_saturation: string | null;
  random_blood_sugar: string | null;
  chest_and_heart: string | null;
  lower_limb: string | null;
  abdomen: string | null;
  diagnosis: string | null;
  lab_results: string | null;
  treatment: string | null;
}

export interface PatientWithVisitCount extends Patient {
  visits: { count: number }[];
}

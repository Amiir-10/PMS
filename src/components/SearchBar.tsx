import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search patients..."
        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-text placeholder-text-muted/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        aria-label="Search patients by name"
      />
    </div>
  );
}

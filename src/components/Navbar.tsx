import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { LogOut, Stethoscope } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <Stethoscope className="w-5 h-5 text-primary" />
          <span className="font-semibold text-text font-[family-name:var(--font-heading)]">
            PMS
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-danger cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

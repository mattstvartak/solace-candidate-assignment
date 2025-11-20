import { Users } from "lucide-react";
import { AdvocatesTable } from "@/components/AdvocatesTable";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#285e50] rounded-2xl mb-6 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-mollie-glaston)]">
            Find Your <span className="text-[#285e50]">Solace</span> Advocate
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with experienced mental health professionals who understand your needs.
            Search by name, location, specialty, or qualifications.
          </p>
        </div>

        <SearchBar />
        <AdvocatesTable />
      </div>
    </main>
  );
}

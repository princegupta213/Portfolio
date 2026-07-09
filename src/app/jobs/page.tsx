"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Copy, Check, ExternalLink, MapPin, Award } from "lucide-react";

interface Startup {
  name: string;
  city: string;
  category: string;
  roles: string;
  contact: string;
  isLead?: boolean;
  url: string;
}

const STARTUPS_DATA: Startup[] = [
  // Direct / Hot Leads
  { name: "73 Strings", city: "Bengaluru", category: "AI/SaaS", roles: "AI Product Specialist, GTM, Strategy", contact: "Direct Lead (Email Founder/Hiring Manager)", isLead: true, url: "https://73strings.com" },
  { name: "Devx", city: "Bengaluru", category: "AI/SaaS", roles: "Associate Product Manager", contact: "Pushpal (LinkedIn Recruiter)", isLead: true, url: "https://devx.work" },
  { name: "Navi", city: "Bengaluru", category: "Fintech", roles: "APM, Business Analyst", contact: "IIT Bombay Alumni Warm Intro", isLead: true, url: "https://navi.com/careers" },
  { name: "Leucine", city: "Bengaluru", category: "AI/SaaS", roles: "APM, Founder's Office", contact: "Instahyre / Tech Recruiters", isLead: true, url: "https://www.leucine.io/careers" },

  // Fintech
  { name: "CRED", city: "Bengaluru", category: "Fintech", roles: "UX Product, Operations", contact: "CRED AND Product Recruiter", url: "https://careers.cred.club" },
  { name: "slice", city: "Bengaluru", category: "Fintech", roles: "APM, Strategy Analyst", contact: "slice AND Product Recruiter", url: "https://careers.sliceit.com" },
  { name: "Groww", city: "Bengaluru", category: "Fintech", roles: "Product Analyst, Business Analyst", contact: "Groww AND Product Recruiter", url: "https://groww.in/careers" },
  { name: "Jupiter", city: "Bengaluru", category: "Fintech", roles: "APM, Operations", contact: "Jupiter Money AND Recruiter", url: "https://jupiter.money/careers" },
  { name: "Fi Money", city: "Bengaluru", category: "Fintech", roles: "Product Strategy", contact: "Fi Money AND Recruiter", url: "https://fi.money/careers" },
  { name: "FamPay", city: "Bengaluru", category: "Fintech", roles: "Growth, APM", contact: "FamPay AND Recruiter", url: "https://fampay.in/careers" },
  { name: "Razorpay", city: "Bengaluru", category: "Fintech", roles: "Product Analyst, GTM", contact: "Razorpay AND Product Recruiter", url: "https://razorpay.com/jobs" },
  { name: "PhonePe", city: "Bengaluru", category: "Fintech", roles: "Strategy Analyst, Business Analyst", contact: "PhonePe AND Talent Acquisition", url: "https://phonepe.com/careers" },
  { name: "Jar", city: "Bengaluru", category: "Fintech", roles: "Founder's Office, Growth", contact: "Jar AND Founder's Office", url: "https://changejar.in/careers" },
  { name: "Smallcase", city: "Bengaluru", category: "Fintech", roles: "Strategy, APM", contact: "Smallcase AND Recruiter", url: "https://smallcase.com/careers" },
  { name: "CoinSwitch", city: "Bengaluru", category: "Fintech", roles: "Strategy, Product Analyst", contact: "CoinSwitch AND Recruiter", url: "https://coinswitch.co/careers" },
  { name: "PayU", city: "Mumbai", category: "Fintech", roles: "APM, Business Analyst", contact: "PayU AND Product Recruiter", url: "https://payu.in/careers" },
  { name: "OneCard", city: "Mumbai", category: "Fintech", roles: "GTM, Product Analyst", contact: "OneCard AND Recruiter", url: "https://getonecard.app/careers" },
  { name: "Indifi", city: "Gurgaon", category: "Fintech", roles: "SME Lending, APM", contact: "Indifi AND Recruiter", url: "https://indifi.com/careers" },
  { name: "InCred", city: "Mumbai", category: "Fintech", roles: "Lending Strategy, Analyst", contact: "InCred AND Recruiter", url: "https://incred.com/careers" },
  { name: "MobiKwik", city: "Gurgaon", category: "Fintech", roles: "GTM, Business Analyst", contact: "MobiKwik AND Recruiter", url: "https://mobikwik.com/careers" },

  // AI & SaaS
  { name: "Postman", city: "Bengaluru", category: "AI/SaaS", roles: "APM, Product Growth", contact: "Postman AND Product Recruiter", url: "https://postman.com/careers" },
  { name: "Hasura", city: "Bengaluru", category: "AI/SaaS", roles: "GTM, Technical PM", contact: "Hasura AND Recruiter", url: "https://hasura.io/careers" },
  { name: "LeadSquared", city: "Bengaluru", category: "AI/SaaS", roles: "Business Analyst", contact: "LeadSquared AND Recruiter", url: "https://leadsquared.com/careers" },
  { name: "Yellow.ai", city: "Bengaluru", category: "AI/SaaS", roles: "Founder's Office, APM", contact: "Yellow.ai AND Recruiter", url: "https://yellow.ai/careers" },
  { name: "CleverTap", city: "Mumbai", category: "AI/SaaS", roles: "Product Analyst, Strategy", contact: "CleverTap AND Product Recruiter", url: "https://clevertap.com/careers" },
  { name: "Whatfix", city: "Bengaluru", category: "AI/SaaS", roles: "GTM, Product Analyst", contact: "Whatfix AND Recruiter", url: "https://whatfix.com/careers" },
  { name: "Hevo Data", city: "Bengaluru", category: "AI/SaaS", roles: "GTM, Product Specialist", contact: "Hevo Data AND Recruiter", url: "https://hevodata.com/careers" },
  { name: "Signzy", city: "Bengaluru", category: "AI/SaaS", roles: "Strategy, Analyst", contact: "Signzy AND Recruiter", url: "https://signzy.com/careers" },
  { name: "Entropik", city: "Bengaluru", category: "AI/SaaS", roles: "GTM, Product Analyst", contact: "Entropik AND Recruiter", url: "https://entropik.io/careers" },
  { name: "Vymo", city: "Bengaluru", category: "AI/SaaS", roles: "GTM, Business Analyst", contact: "Vymo AND Recruiter", url: "https://getvymo.com/careers" },
  { name: "BrowserStack", city: "Mumbai", category: "AI/SaaS", roles: "APM, GTM Analyst", contact: "BrowserStack AND Product Recruiter", url: "https://browserstack.com/careers" },
  { name: "Haptik", city: "Mumbai", category: "AI/SaaS", roles: "APM, GTM", contact: "Haptik AND Recruiter", url: "https://haptik.ai/careers" },
  { name: "WebEngage", city: "Mumbai", category: "AI/SaaS", roles: "GTM, Product Analyst", contact: "WebEngage AND Recruiter", url: "https://webengage.com/careers" },
  { name: "Doubtnut", city: "Gurgaon", category: "AI/SaaS", roles: "GTM, Product Analyst", contact: "Doubtnut AND Recruiter", url: "https://doubtnut.com/careers" },

  // Consumer & Logistics
  { name: "Swiggy", city: "Bengaluru", category: "Consumer", roles: "APM, Strategy", contact: "Swiggy AND Product Recruiter", url: "https://careers.swiggy.com" },
  { name: "Zepto", city: "Mumbai", category: "Consumer", roles: "Growth, GTM, Founder's Office", contact: "Zepto AND Product Recruiter", url: "https://zepto.com/careers" },
  { name: "Meesho", city: "Bengaluru", category: "Consumer", roles: "GTM, Product Analyst", contact: "Meesho AND Product Recruiter", url: "https://meesho.careers" },
  { name: "Zomato", city: "Gurgaon", category: "Consumer", roles: "Founder's Office, Strategy", contact: "Zomato AND Product Recruiter", url: "https://zomato.com/careers" },
  { name: "Blinkit", city: "Gurgaon", category: "Consumer", roles: "Growth, APM", contact: "Blinkit AND Product Recruiter", url: "https://blinkit.com/careers" },
  { name: "Urban Company", city: "Gurgaon", category: "Consumer", roles: "APM, Strategy, Operations", contact: "Urban Company AND Product Recruiter", url: "https://urbancompany.com/careers" },
  { name: "Nykaa", city: "Mumbai", category: "Consumer", roles: "GTM, Product Analyst", contact: "Nykaa AND Recruiter", url: "https://nykaa.com/careers" },
  { name: "BookMyShow", city: "Mumbai", category: "Consumer", roles: "APM, Growth, Strategy", contact: "BookMyShow AND Recruiter", url: "https://in.bookmyshow.com/careers" },
  { name: "Delhivery", city: "Gurgaon", category: "Consumer", roles: "Operations Strategy, Analyst", contact: "Delhivery AND Recruiter", url: "https://delhivery.com/careers" },
  { name: "Ola Electric", city: "Bengaluru", category: "Consumer", roles: "Strategy Analyst, Founder's Office", contact: "Ola Electric AND Recruiter", url: "https://olaelectric.com/careers" },
  { name: "Spinny", city: "Gurgaon", category: "Consumer", roles: "Business Analyst, Growth", contact: "Spinny AND Recruiter", url: "https://spinny.com/careers" },
  { name: "Cars24", city: "Gurgaon", category: "Consumer", roles: "GTM, Strategy Analyst", contact: "Cars24 AND Recruiter", url: "https://cars24.com/careers" },
  { name: "MakeMyTrip", city: "Gurgaon", category: "Consumer", roles: "APM, Strategy Analyst", contact: "MakeMyTrip AND Product Recruiter", url: "https://careers.makemytrip.com" },
  { name: "SolarSquare", city: "Bengaluru", category: "Consumer", roles: "Founder's Office, Cleantech", contact: "SolarSquare AND Recruiter", url: "https://solarsquare.in/careers" }
];

export default function JobsDashboardPage() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [copyingText, setCopyingText] = useState<string | null>(null);

  const handleCopy = (contact: string) => {
    const formatted = `"${contact.split(" AND ")[0]}" AND ("Product Recruiter" OR "Talent Acquisition")`;
    navigator.clipboard.writeText(formatted).then(() => {
      setCopyingText(contact);
      setTimeout(() => setCopyingText(null), 2000);
    });
  };

  const filteredStartups = useMemo(() => {
    return STARTUPS_DATA.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roles.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === "all" || s.city === cityFilter;
      const matchesCat = catFilter === "all" || s.category === catFilter;
      return matchesSearch && matchesCity && matchesCat;
    });
  }, [search, cityFilter, catFilter]);

  const blrCount = STARTUPS_DATA.filter((s) => s.city === "Bengaluru").length;
  const gurCount = STARTUPS_DATA.filter((s) => s.city === "Gurgaon").length;
  const mumCount = STARTUPS_DATA.filter((s) => s.city === "Mumbai").length;

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" /> Back to portfolio
            </Link>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Startup Jobs Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Search and filter early career (0-3 years) opportunities in Product, Strategy, GTM, and Founder's Office.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Total Tracked</span>
            <span className="text-2xl font-black text-zinc-800 mt-1 block">{STARTUPS_DATA.length}</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bengaluru</span>
            <span className="text-2xl font-black text-zinc-800 mt-1 block">{blrCount}</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Gurugram</span>
            <span className="text-2xl font-black text-zinc-800 mt-1 block">{gurCount}</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Mumbai</span>
            <span className="text-2xl font-black text-zinc-800 mt-1 block">{mumCount}</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name, category, or role keywords..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-400 uppercase tracking-wider min-w-[70px]">City:</span>
              <div className="flex gap-1">
                {["all", "Bengaluru", "Gurgaon", "Mumbai"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setCityFilter(city)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      cityFilter === city
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {city === "all" ? "All" : city}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-400 uppercase tracking-wider min-w-[70px]">Category:</span>
              <div className="flex gap-1">
                {[
                  { id: "all", label: "All" },
                  { id: "Fintech", label: "Fintech" },
                  { id: "AI/SaaS", label: "AI & SaaS" },
                  { id: "Consumer", label: "Consumer & Logistics" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCatFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      catFilter === cat.id
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Startups Table */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Target Roles</th>
                  <th className="px-6 py-4">Outreach Route</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredStartups.length > 0 ? (
                  filteredStartups.map((s) => (
                    <tr key={s.name} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900">{s.name}</span>
                          {s.isLead && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 animate-pulse">
                              <Award className="h-3 w-3" /> Active Lead
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-600 bg-zinc-100">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" /> {s.city}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50">
                          {s.category === "AI/SaaS" ? "AI & SaaS" : s.category === "Fintech" ? "Fintech" : "Consumer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-800">{s.roles}</td>
                      <td className="px-6 py-4">
                        {s.isLead ? (
                          <span className="text-xs font-bold text-emerald-600">{s.contact}</span>
                        ) : (
                          <button
                            onClick={() => handleCopy(s.contact)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-200 bg-zinc-50 font-mono text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                          >
                            {copyingText === s.contact ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" /> Copied query
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy query
                              </>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-800 text-xs font-bold text-zinc-800 transition-colors"
                        >
                          Visit site <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-medium">
                      No startup found matching your search. Try resetting filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

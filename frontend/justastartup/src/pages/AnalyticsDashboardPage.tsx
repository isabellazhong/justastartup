import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthNavbar, TrendsChart } from '../components';

export default function AnalyticsDashboardPage() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const canAnalyze = name.trim().length > 0 && idea.trim().length > 0;

  // Initialize from URL query params (e.g., /analytics?name=...&idea=...)
  useEffect(() => {
    const initialName = searchParams.get('name') || '';
    const initialIdea = searchParams.get('idea') || '';
    if (initialName) setName(initialName);
    if (initialIdea) setIdea(initialIdea);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSummary = async () => {
    if (!canAnalyze) return;
    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const params = new URLSearchParams();
      params.append('name', name.trim());
      params.append('idea', idea.trim());
      const res = await fetch(`${apiUrl}/api/serp/trends/summary?${params.toString()}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setSummary(json.response || '');
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to load summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    // Optionally auto-fetch when both fields are filled
    if (canAnalyze) {
      fetchSummary();
    } else {
      setSummary('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, idea]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <AuthNavbar />
      <main className="flex-1 w-full overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Graphs, stats, and viability reasoning for your business idea.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-lg font-medium mb-4">Project Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Project Name</label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. EcoRide e-scooter"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="idea" className="block text-sm font-medium mb-1">Project Description</label>
                    <textarea
                      id="idea"
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="Briefly describe the product and its value proposition"
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 opacity-50"
                    />
                  </div>
                  <button
                    onClick={fetchSummary}
                    disabled={!canAnalyze || loadingSummary}
                    className="w-full inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 disabled:opacity-50"
                  >
                    {loadingSummary ? 'Analyzing…' : 'Analyze Viability'}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-lg font-medium mb-4">Market Trends Analysis</h2>
                {canAnalyze ? (
                  <div className="h-[360px]">
                    <TrendsChart name={name} idea={idea} />
                  </div>
                ) : (
                  <div className="h-[360px] flex items-center justify-center text-gray-500 border border-dashed rounded-md">
                    Enter project details to view trend analysis
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-medium mb-3">Viability Summary</h2>
              {!canAnalyze && (
                <p className="text-gray-500">Provide a name and description to generate a summary.</p>
              )}
              {summaryError && (
                <p className="text-red-600">{summaryError}</p>
              )}
              {loadingSummary && canAnalyze && (
                <p className="text-gray-600">Generating summary…</p>
              )}
              {!loadingSummary && canAnalyze && summary && (
                <div className="prose max-w-none whitespace-pre-line">{summary}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
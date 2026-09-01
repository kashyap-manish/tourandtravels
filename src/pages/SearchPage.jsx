import { useState, useEffect } from "react";
import SearchResults from "../components/SearchResult";
import RelatedSearches from "../components/RelatedSearch";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [relatedSearches, setRelatedSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!submittedQuery) return;

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(submittedQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Search request failed");
        return res.json();
      })
      .then((data) => {
        setResults(data.results || []);
        setRelatedSearches(data.relatedSearches || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong. Please try again.");
        setResults([]);
        setRelatedSearches([]);
      })
      .finally(() => setLoading(false));
  }, [submittedQuery]);

  const handleSearch = () => {
    if (query.trim()) setSubmittedQuery(query.trim());
  };

  const handleRelatedClick = (term) => {
    setQuery(term);
    setSubmittedQuery(term);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 16, cursor: "pointer" }}>
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <SearchResults results={results} />}
      <RelatedSearches items={relatedSearches} onSelect={handleRelatedClick} />
    </div>
  );
}

export default SearchPage;

function SearchResults({ results = [] }) {
  if (!results.length) return null;

  return (
    <div style={{ marginTop: 20 }}>
      {results.map((r) => (
        <div
          key={r.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          {r.title}
        </div>
      ))}
    </div>
  );
}

export default SearchResults;

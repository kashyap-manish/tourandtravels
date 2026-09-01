function RelatedSearches({ items = [], onSelect }) {
  if (!items.length) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h4>Related searches</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((term, i) => (
          <button
            key={i}
            onClick={() => onSelect(term)}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RelatedSearches;

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text short"></div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        {Array(columns).fill(0).map((_, i) => (
          <div key={i} className="skeleton-line skeleton-header"></div>
        ))}
      </div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          {Array(columns).fill(0).map((_, j) => (
            <div key={j} className="skeleton-line skeleton-cell"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="skeleton-stats-grid">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="skeleton-circle"></div>
          <div className="skeleton-line skeleton-number"></div>
          <div className="skeleton-line skeleton-label"></div>
        </div>
      ))}
    </div>
  );
}
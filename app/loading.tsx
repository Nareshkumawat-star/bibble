export default function Loading() {
  return (
    <div className="status-page-wrapper" role="status" aria-label="Loading page">
      <main className="status-content">
        <div className="cozy-loading-container">
          <div className="cozy-loading-pulse">
            <span className="cozy-loading-icon">🍓</span>
          </div>
          <p className="cozy-loading-text">Gathering bibbles...</p>
        </div>
      </main>
    </div>
  );
}

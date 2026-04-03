import React, { useState } from "react";

function KnowledgePanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="knowledge-panel">
      <div className="knowledge-header">
        <div className="knowledge-logo">
          <span className="knowledge-icon">🍿</span>
          <div className="knowledge-title">
            <h2>UsePopcorn</h2>
            <p className="knowledge-subtitle">Movie Discovery Platform</p>
          </div>
        </div>
        <button
          className="knowledge-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle knowledge panel"
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {isExpanded && (
        <div className="knowledge-content">
          <div className="knowledge-section">
            <h3>About UsePopcorn</h3>
            <p>
              A free movie discovery platform that helps you search for movies,
              view ratings, watch trailers, and maintain a personal watchlist.
              Your data stays private with local browser storage.
            </p>
          </div>

          <div className="knowledge-section">
            <h3>Key Features</h3>
            <ul className="knowledge-features">
              <li>🔍 Movie Search & Discovery</li>
              <li>⭐ IMDB Ratings Integration</li>
              <li>📝 Personal Movie Ratings</li>
              <li>📋 Watchlist Management</li>
              <li>🎬 Movie Trailers & Details</li>
              <li>🔒 Privacy-First (Local Storage)</li>
            </ul>
          </div>

          <div className="knowledge-section">
            <h3>Quick Stats</h3>
            <div className="knowledge-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Data Collection</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Movies Available</span>
              </div>
            </div>
          </div>

          <div className="knowledge-section">
            <h3>Developer</h3>
            <div className="developer-info">
              <span className="developer-name">Asif Khan</span>
              <a
                href="https://github.com/asifkhan2513"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-link"
              >
                GitHub Profile
              </a>
            </div>
          </div>

          <div className="knowledge-section">
            <h3>Website</h3>
            <a
              href="https://www.usepopcorn.store/"
              target="_blank"
              rel="noopener noreferrer"
              className="website-link"
            >
              www.usepopcorn.store
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default KnowledgePanel;

/**
 * SahiScore AI — Main Application Router
 * 
 * Hash-based SPA router managing 4 views:
 * - Landing (#/)
 * - Assess (#/assess)
 * - Results (#/results)
 * - Dashboard (#/dashboard)
 */

import './styles/index.css';
import { renderLanding } from './pages/landing.js';
import { renderAssess, initAssess } from './pages/assess.js';
import { renderResults, initResults } from './pages/results.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { calculateCreditScore } from './engine/scoring.js';

// App state
const state = {
  currentScoreResult: null,
  assessments: [],
};

/**
 * Navbar component
 */
function renderNavbar(activePath) {
  const links = [
    { path: '#/', label: 'Home', icon: '🏠' },
    { path: '#/assess', label: 'Assess', icon: '📝' },
    { path: '#/results', label: 'Results', icon: '📊' },
    { path: '#/dashboard', label: 'Dashboard', icon: '📈' },
  ];

  const navLinks = links.map(link => {
    const isActive = activePath === link.path ||
      (link.path === '#/' && activePath === '') ||
      (link.path === '#/' && activePath === '#');
    return `<a href="${link.path}" class="nav-link ${isActive ? 'active' : ''}">${link.icon} ${link.label}</a>`;
  }).join('');

  return `
    <nav class="navbar" id="main-navbar">
      <div class="container">
        <a href="#/" class="nav-brand">
          <div class="nav-brand-icon">💳</div>
          SahiScore AI
        </a>
        <div class="nav-links" id="nav-links">
          ${navLinks}
        </div>
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `;
}

/**
 * Route handler
 */
function navigateTo(hash) {
  const app = document.getElementById('app');
  if (!app) return;

  const path = hash || '#/';

  let content = '';

  switch (path) {
    case '#/':
    case '':
    case '#':
      content = renderNavbar(path) + renderLanding();
      break;

    case '#/assess':
      content = renderNavbar(path) + renderAssess();
      break;

    case '#/results':
      content = renderNavbar(path) + renderResults(state.currentScoreResult);
      break;

    case '#/dashboard':
      content = renderNavbar(path) + renderDashboard(state.assessments);
      break;

    default:
      content = renderNavbar(path) + renderLanding();
  }

  app.innerHTML = content;

  // Initialize page-specific logic
  switch (path) {
    case '#/assess':
      initAssess((formData) => {
        // Run scoring engine
        state.currentScoreResult = calculateCreditScore(formData);

        // Store assessment for dashboard
        const assessment = {
          id: `custom-${Date.now()}`,
          name: formData.name,
          occupation: formData.occupation,
          shg: formData.shgName,
          score: state.currentScoreResult.score,
          risk: state.currentScoreResult.risk,
          eligibility: state.currentScoreResult.eligibility,
          emoji: '👩',
        };

        // Avoid duplicates by name
        const existingIndex = state.assessments.findIndex(a => a.name === assessment.name);
        if (existingIndex >= 0) {
          state.assessments[existingIndex] = assessment;
        } else {
          state.assessments.push(assessment);
        }

        // Navigate to results
        window.location.hash = '#/results';
      });
      break;

    case '#/results':
      initResults(state.currentScoreResult);
      break;

    case '#/dashboard':
      initDashboard(state.assessments);
      break;
  }

  // Initialize hamburger menu
  initHamburger();

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Hamburger menu toggle
 */
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  navigateTo(window.location.hash);
});

// Initial route
navigateTo(window.location.hash);

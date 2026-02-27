/**
 * Dashboard Page — MFI Officer Overview
 */
import { Chart, registerables } from 'chart.js';
import { demoProfiles } from '../engine/profiles.js';
import { calculateCreditScore } from '../engine/scoring.js';

Chart.register(...registerables);

let distributionChartInstance = null;

// Pre-calculate scores for all demo profiles + generate some synthetic ones
function generateDashboardData(customAssessments) {
  const allApplicants = [];

  // Add demo profiles
  demoProfiles.forEach(profile => {
    const result = calculateCreditScore(profile.data);
    allApplicants.push({
      id: profile.id,
      name: profile.name,
      occupation: profile.data.occupation,
      shg: profile.data.shgName,
      score: result.score,
      risk: result.risk,
      eligibility: result.eligibility,
      categories: result.categories,
      emoji: profile.emoji,
    });
  });

  // Add synthetic applicants for a more realistic dashboard
  const synthetic = [
    { name: 'Sunita Yadav', occupation: 'Dairy Farmer', shg: 'Gau Mata SHG', emoji: '🐄', score: 710, risk: { level: 'Medium', color: '#f59e0b' } },
    { name: 'Meena Patel', occupation: 'Pottery Artisan', shg: 'Kala Kriti SHG', emoji: '🏺', score: 765, risk: { level: 'Low', color: '#10b981' } },
    { name: 'Radha Devi', occupation: 'Tailoring', shg: 'Silai Kendra SHG', emoji: '🧵', score: 620, risk: { level: 'Medium', color: '#f59e0b' } },
    { name: 'Kavita Singh', occupation: 'Spice Trader', shg: 'Masala Mahila SHG', emoji: '🌶️', score: 540, risk: { level: 'High', color: '#ef4444' } },
    { name: 'Fatima Begum', occupation: 'Embroidery', shg: 'Chikan Kari SHG', emoji: '🪡', score: 680, risk: { level: 'Medium', color: '#f59e0b' } },
  ];

  synthetic.forEach(s => {
    allApplicants.push({
      ...s,
      id: s.name.toLowerCase().replace(/\s/g, '-'),
      eligibility: s.score >= 720
        ? { eligible: true, maxAmount: 80000 }
        : s.score >= 580
          ? { eligible: true, maxAmount: 40000 }
          : { eligible: false, maxAmount: 15000 },
    });
  });

  // Add custom assessments if any
  if (customAssessments && customAssessments.length > 0) {
    customAssessments.forEach(a => {
      allApplicants.push(a);
    });
  }

  return allApplicants;
}

export function renderDashboard(customAssessments) {
  const applicants = generateDashboardData(customAssessments);

  const totalAssessed = applicants.length;
  const approved = applicants.filter(a => a.score >= 580).length;
  const avgScore = Math.round(applicants.reduce((sum, a) => sum + a.score, 0) / totalAssessed);
  const lowRisk = applicants.filter(a => a.risk.level === 'Low').length;

  const tableRows = applicants.map(a => {
    const badgeClass = a.risk.level === 'Low' ? 'badge-success' : a.risk.level === 'Medium' ? 'badge-warning' : 'badge-danger';
    return `
      <tr class="applicant-row" data-id="${a.id}" style="cursor: pointer;">
        <td>
          <div class="flex items-center gap-sm">
            <span style="font-size: 1.3rem;">${a.emoji || '👩'}</span>
            <div>
              <strong style="color: var(--text-primary);">${a.name}</strong>
              <div class="text-sm text-muted">${a.occupation}</div>
            </div>
          </div>
        </td>
        <td>${a.shg || '—'}</td>
        <td><strong style="color: ${a.risk.color};">${a.score}</strong></td>
        <td><span class="badge ${badgeClass}">${a.risk.level}</span></td>
        <td>₹${(a.eligibility?.maxAmount || 0).toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  return `
    <section class="page" id="dashboard-page">
      <div class="container">
        <div class="section-header animate-fade-in-up">
          <h2>MFI Officer Dashboard</h2>
          <p>Overview of all credit assessments and applicant risk profiles.</p>
        </div>

        <!-- Summary Stats -->
        <div class="stat-grid animate-fade-in-up delay-1">
          <div class="stat-card">
            <div class="stat-value">${totalAssessed}</div>
            <div class="stat-label">Total Assessed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${approved}</div>
            <div class="stat-label">Eligible for Loan</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${avgScore}</div>
            <div class="stat-label">Average Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${lowRisk}</div>
            <div class="stat-label">Low Risk Applicants</div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid-2 mt-xl">
          <div class="card animate-fade-in-up delay-2">
            <h3 style="font-size: 1.1rem; margin-bottom: var(--space-lg);">📊 Score Distribution</h3>
            <div style="position: relative; height: 280px;">
              <canvas id="distribution-chart"></canvas>
            </div>
          </div>
          <div class="card animate-fade-in-up delay-3">
            <h3 style="font-size: 1.1rem; margin-bottom: var(--space-lg);">📋 Risk Breakdown</h3>
            <div style="position: relative; height: 280px;">
              <canvas id="risk-breakdown-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Applicant Table -->
        <div class="card mt-xl animate-fade-in-up delay-4">
          <div class="flex justify-between items-center mb-lg">
            <h3 style="font-size: 1.1rem;">👥 All Applicants</h3>
            <a href="#/assess" class="btn btn-sm btn-primary">+ New Assessment</a>
          </div>
          <div class="table-container">
            <table id="applicants-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>SHG</th>
                  <th>Score</th>
                  <th>Risk</th>
                  <th>Loan Capacity</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Impact Highlight -->
        <div class="card mt-xl animate-fade-in-up delay-5" style="background: linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(245, 158, 11, 0.04)); border-color: var(--border-accent);">
          <div class="text-center">
            <h3 style="font-size: 1.3rem;">🌟 Impact Summary</h3>
            <p class="mt-md" style="max-width: 600px; margin-left: auto; margin-right: auto;">
              Through SahiScore AI, we have assessed <strong style="color: var(--text-primary);">${totalAssessed} women entrepreneurs</strong>
              who previously had no formal credit score. Of these, <strong style="color: var(--color-success);">${approved} are now eligible</strong>
              for micro-loans — unlocking an estimated <strong style="color: var(--color-accent);">₹${(applicants.filter(a => a.score >= 580).reduce((s, a) => s + (a.eligibility?.maxAmount || 0), 0)).toLocaleString('en-IN')}</strong>
              in potential credit.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal for applicant detail -->
    <div id="applicant-modal"></div>
  `;
}

export function initDashboard(customAssessments) {
  const applicants = generateDashboardData(customAssessments);

  renderDistributionChart(applicants);
  renderRiskBreakdownChart(applicants);

  // Applicant row click
  document.querySelectorAll('.applicant-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const applicant = applicants.find(a => a.id === id);
      if (applicant) showApplicantModal(applicant);
    });
  });
}

function renderDistributionChart(applicants) {
  const canvas = document.getElementById('distribution-chart');
  if (!canvas) return;

  if (distributionChartInstance) distributionChartInstance.destroy();

  // Score buckets
  const buckets = { '300-449': 0, '450-579': 0, '580-719': 0, '720-900': 0 };
  applicants.forEach(a => {
    if (a.score < 450) buckets['300-449']++;
    else if (a.score < 580) buckets['450-579']++;
    else if (a.score < 720) buckets['580-719']++;
    else buckets['720-900']++;
  });

  distributionChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.keys(buckets),
      datasets: [{
        label: 'Applicants',
        data: Object.values(buckets),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
        ],
        borderRadius: 8,
        barThickness: 40,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#64748b', font: { family: 'Inter' }, stepSize: 1 },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        x: {
          ticks: { color: '#94a3b8', font: { family: 'Inter' } },
          grid: { display: false }
        }
      }
    }
  });
}

function renderRiskBreakdownChart(applicants) {
  const canvas = document.getElementById('risk-breakdown-chart');
  if (!canvas) return;

  const low = applicants.filter(a => a.risk.level === 'Low').length;
  const med = applicants.filter(a => a.risk.level === 'Medium').length;
  const high = applicants.filter(a => a.risk.level === 'High').length;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Low Risk', 'Medium Risk', 'High Risk'],
      datasets: [{
        data: [low, med, high],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: 'rgba(10, 15, 26, 0.8)',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            padding: 16,
            font: { family: 'Inter', size: 12 },
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
        }
      }
    }
  });
}

function showApplicantModal(applicant) {
  const modal = document.getElementById('applicant-modal');
  if (!modal) return;

  const badgeClass = applicant.risk.level === 'Low' ? 'badge-success' : applicant.risk.level === 'Medium' ? 'badge-warning' : 'badge-danger';

  modal.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" id="modal-close-btn">&times;</button>
        <div class="flex items-center gap-md mb-lg">
          <span style="font-size: 2.5rem;">${applicant.emoji || '👩'}</span>
          <div>
            <h3>${applicant.name}</h3>
            <p class="text-sm text-muted">${applicant.occupation} • ${applicant.shg || 'Independent'}</p>
          </div>
        </div>

        <div class="stat-grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-md);">
          <div class="stat-card" style="padding: var(--space-lg);">
            <div class="stat-value" style="font-size: 2rem; color: ${applicant.risk.color};">${applicant.score}</div>
            <div class="stat-label">Credit Score</div>
          </div>
          <div class="stat-card" style="padding: var(--space-lg);">
            <div style="margin-bottom: var(--space-sm);">
              <span class="badge ${badgeClass}">${applicant.risk.level} Risk</span>
            </div>
            <div class="stat-label">Risk Level</div>
          </div>
        </div>

        <div class="mt-lg">
          <div class="eligibility-detail">
            <span class="eligibility-label">Loan Eligibility</span>
            <span class="eligibility-value">
              <span class="badge ${applicant.eligibility?.eligible ? 'badge-success' : 'badge-warning'}">
                ${applicant.eligibility?.eligible ? 'Eligible' : 'Conditional'}
              </span>
            </span>
          </div>
          <div class="eligibility-detail">
            <span class="eligibility-label">Max Loan Amount</span>
            <span class="eligibility-value">₹${(applicant.eligibility?.maxAmount || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="flex justify-center mt-lg">
          <a href="#/assess" class="btn btn-sm btn-primary">Reassess Applicant</a>
        </div>
      </div>
    </div>
  `;

  // Close handlers
  document.getElementById('modal-close-btn')?.addEventListener('click', () => modal.innerHTML = '');
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') modal.innerHTML = '';
  });
}

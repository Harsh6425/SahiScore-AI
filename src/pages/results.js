/**
 * Results Page — AI Credit Score with explainability
 */
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let factorChartInstance = null;
let categoryChartInstance = null;

export function renderResults(scoreResult) {
  if (!scoreResult) {
    return `
      <section class="page">
        <div class="container text-center" style="padding-top: 120px;">
          <h2>No Assessment Data</h2>
          <p class="mt-md">Please complete an assessment first.</p>
          <a href="#/assess" class="btn btn-primary mt-lg">Go to Assessment</a>
        </div>
      </section>
    `;
  }

  const { score, risk, categories, factorContributions, eligibility, recommendations, biasNote, applicantName } = scoreResult;

  const circumference = 2 * Math.PI * 110;
  const scorePercent = (score - 300) / 600;
  const targetOffset = circumference * (1 - scorePercent);

  const scoreColor = score >= 720 ? '#10b981' : score >= 580 ? '#f59e0b' : '#ef4444';

  const riskBadgeClass = risk.level === 'Low' ? 'badge-success' : risk.level === 'Medium' ? 'badge-warning' : 'badge-danger';

  const categoryBars = categories.map(cat => {
    const percentage = Math.round(cat.score * 100);
    const barColor = percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';
    return `
      <div class="factor-bar">
        <div class="factor-label">${cat.icon} ${cat.name}</div>
        <div class="factor-bar-track">
          <div class="factor-bar-fill" style="width: ${percentage}%; background: ${barColor};" data-width="${percentage}"></div>
        </div>
        <div class="factor-value" style="color: ${barColor}">${percentage}%</div>
      </div>
    `;
  }).join('');

  const recommendationItems = recommendations.map(r => `
    <li class="recommendation-item">
      <span class="recommendation-icon">${r.icon}</span>
      <span class="recommendation-text">${r.text}</span>
    </li>
  `).join('');

  return `
    <section class="page" id="results-page">
      <div class="container">
        <div class="section-header animate-fade-in-up">
          <h2>Credit Score Report</h2>
          <p>AI-generated credit assessment for <strong style="color: var(--text-primary);">${applicantName}</strong></p>
        </div>

        <div class="results-grid">
          <!-- Left Column: Score Gauge -->
          <div class="animate-fade-in-up delay-1">
            <div class="card" style="text-align: center;">
              <div class="score-gauge-container">
                <svg class="score-gauge-svg" viewBox="0 0 240 240">
                  <circle class="score-gauge-bg" cx="120" cy="120" r="110" />
                  <circle class="score-gauge-fill" cx="120" cy="120" r="110"
                    stroke="${scoreColor}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${circumference}"
                    data-target="${targetOffset}"
                    id="score-fill-circle" />
                </svg>
                <div class="score-gauge-center">
                  <div class="score-gauge-value" style="color: ${scoreColor}" id="score-counter">0</div>
                  <div class="score-gauge-label">out of 900</div>
                </div>
              </div>
              <div class="mt-lg">
                <span class="badge ${riskBadgeClass}" style="font-size: 0.9rem; padding: 8px 20px;">
                  ${risk.level} Risk
                </span>
              </div>
              <p class="mt-md text-sm text-muted">${risk.label}</p>
            </div>

            <!-- Bias Transparency -->
            <div class="card mt-lg" style="border-color: rgba(59, 130, 246, 0.2); background: rgba(59, 130, 246, 0.05);">
              <div class="flex items-center gap-sm mb-md">
                <span style="font-size: 1.2rem;">🛡️</span>
                <h4 style="font-size: 0.95rem;">Bias-Free Assessment</h4>
              </div>
              <p class="text-sm">${biasNote}</p>
            </div>
          </div>

          <!-- Right Column: Breakdown -->
          <div class="animate-fade-in-up delay-2">
            <!-- Category Breakdown -->
            <div class="card">
              <h3 style="font-size: 1.1rem; margin-bottom: var(--space-lg);">📊 Score Breakdown by Category</h3>
              ${categoryBars}
            </div>

            <!-- Factor Contributions Chart -->
            <div class="card mt-lg">
              <h3 style="font-size: 1.1rem; margin-bottom: var(--space-lg);">🔍 Factor Contributions (Explainability)</h3>
              <p class="text-sm text-muted mb-lg">Shows how each factor positively or negatively impacts the credit score — inspired by SHAP (SHapley Additive exPlanations) values used in real ML models.</p>
              <div style="position: relative; height: 400px;">
                <canvas id="factor-chart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Details Chart -->
        <div class="card mt-xl animate-fade-in-up delay-3">
          <h3 style="font-size: 1.1rem; margin-bottom: var(--space-lg);">📈 Category Weight Distribution</h3>
          <div style="position: relative; max-width: 400px; margin: 0 auto; height: 300px;">
            <canvas id="category-chart"></canvas>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="card mt-xl animate-fade-in-up delay-4">
          <h3 style="font-size: 1.1rem; margin-bottom: var(--space-lg);">💡 Recommendations to Improve Score</h3>
          <ul class="recommendation-list">
            ${recommendationItems}
          </ul>
        </div>

        <!-- Loan Eligibility -->
        <div class="eligibility-card mt-xl animate-fade-in-up delay-5">
          <h3>🏦 Loan Eligibility Summary</h3>
          <div style="margin-top: var(--space-lg);">
            <div class="eligibility-detail">
              <span class="eligibility-label">Status</span>
              <span class="eligibility-value">
                <span class="badge ${eligibility.eligible ? 'badge-success' : 'badge-warning'}">
                  ${eligibility.eligible ? '✅ Eligible' : '⚠️ Conditional'}
                </span>
              </span>
            </div>
            <div class="eligibility-detail">
              <span class="eligibility-label">Maximum Loan Amount</span>
              <span class="eligibility-value">₹${eligibility.maxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="eligibility-detail">
              <span class="eligibility-label">Suggested Interest Rate</span>
              <span class="eligibility-value">${eligibility.interestRate}</span>
            </div>
            <div class="eligibility-detail">
              <span class="eligibility-label">Maximum Tenure</span>
              <span class="eligibility-value">${eligibility.tenure}</span>
            </div>
            <div class="eligibility-detail">
              <span class="eligibility-label">Recommendation</span>
              <span class="eligibility-value" style="max-width: 350px; text-align: right;">${eligibility.recommendation}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-md mt-xl animate-fade-in-up delay-6">
          <a href="#/assess" class="btn btn-outline">← New Assessment</a>
          <a href="#/dashboard" class="btn btn-primary">View Dashboard →</a>
        </div>
      </div>
    </section>
  `;
}

/**
 * Initialize animations and charts on results page
 */
export function initResults(scoreResult) {
  if (!scoreResult) return;

  // Animate score counter
  const scoreCounter = document.getElementById('score-counter');
  if (scoreCounter) {
    animateCounter(scoreCounter, 0, scoreResult.score, 1500);
  }

  // Animate gauge circle
  const fillCircle = document.getElementById('score-fill-circle');
  if (fillCircle) {
    setTimeout(() => {
      fillCircle.style.strokeDashoffset = fillCircle.dataset.target;
    }, 200);
  }

  // Animate factor bars
  document.querySelectorAll('.factor-bar-fill').forEach((bar, i) => {
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = bar.dataset.width + '%';
    }, 300 + i * 150);
  });

  // Factor contributions chart
  renderFactorChart(scoreResult.factorContributions);

  // Category chart
  renderCategoryChart(scoreResult.categories);
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const value = Math.round(start + (end - start) * eased);
    element.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function renderFactorChart(contributions) {
  const canvas = document.getElementById('factor-chart');
  if (!canvas) return;

  // Destroy previous instance
  if (factorChartInstance) {
    factorChartInstance.destroy();
  }

  const sorted = [...contributions].sort((a, b) => b.contribution - a.contribution);
  const labels = sorted.map(f => f.name);
  const data = sorted.map(f => f.contribution);
  const maxData = sorted.map(f => f.maxContribution);
  const colors = sorted.map(f =>
    f.score >= 0.7 ? 'rgba(16, 185, 129, 0.8)' :
    f.score >= 0.5 ? 'rgba(245, 158, 11, 0.8)' :
    'rgba(239, 68, 68, 0.8)'
  );

  factorChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Actual Contribution',
          data,
          backgroundColor: colors,
          borderRadius: 4,
          barThickness: 16,
        },
        {
          label: 'Maximum Possible',
          data: maxData,
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 4,
          barThickness: 16,
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: +${ctx.raw} points`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
          title: { display: true, text: 'Score Points Contribution', color: '#64748b', font: { family: 'Inter' } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        }
      }
    }
  });
}

function renderCategoryChart(categories) {
  const canvas = document.getElementById('category-chart');
  if (!canvas) return;

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  categoryChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => `${c.icon} ${c.name} (${Math.round(c.weight * 100)}%)`),
      datasets: [{
        data: categories.map(c => Math.round(c.weight * 100)),
        backgroundColor: [
          'rgba(13, 148, 136, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: 'rgba(10, 15, 26, 0.8)',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            padding: 16,
            font: { family: 'Inter', size: 12 },
            usePointStyle: true,
            pointStyleWidth: 12,
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

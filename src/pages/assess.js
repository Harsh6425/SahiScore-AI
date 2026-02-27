/**
 * Assessment Page — Field worker data entry form
 */
import { demoProfiles } from '../engine/profiles.js';

export function renderAssess() {
  const profileButtons = demoProfiles.map(p => `
    <button class="profile-btn" data-profile-id="${p.id}" id="profile-btn-${p.id}">
      <div class="profile-avatar">${p.emoji}</div>
      <div class="profile-info">
        <h4>${p.name}</h4>
        <p>${p.tagline}</p>
      </div>
    </button>
  `).join('');

  return `
    <section class="page" id="assess-page">
      <div class="container" style="max-width: 900px;">
        <div class="section-header animate-fade-in-up">
          <h2>Credit Assessment</h2>
          <p>Collect alternative data from the applicant to generate an AI-powered credit score.</p>
        </div>

        <!-- Demo Profiles -->
        <div class="animate-fade-in-up delay-1">
          <p class="text-sm text-muted mb-md">⚡ Quick demo — click a profile to auto-fill:</p>
          <div class="profile-selector">
            ${profileButtons}
          </div>
        </div>

        <!-- Assessment Form -->
        <form id="assessment-form" class="animate-fade-in-up delay-2">

          <!-- Personal Information -->
          <div class="form-section">
            <div class="form-section-title">
              <div class="form-section-icon">👤</div>
              Personal Information
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="input-name">Full Name</label>
                <input class="form-input" type="text" id="input-name" placeholder="Enter applicant's name" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-age">Age</label>
                <input class="form-input" type="number" id="input-age" min="18" max="80" placeholder="Age" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-occupation">Occupation</label>
                <input class="form-input" type="text" id="input-occupation" placeholder="e.g. Handloom Weaver" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-shg-name">SHG Name</label>
                <input class="form-input" type="text" id="input-shg-name" placeholder="Self-Help Group name" />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-shg-years">SHG Membership (years)</label>
                <input class="form-input" type="number" id="input-shg-years" min="0" max="30" placeholder="Years" />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-dependents">Number of Dependents</label>
                <input class="form-input" type="number" id="input-dependents" min="0" max="15" placeholder="Dependents" />
              </div>
            </div>
          </div>

          <!-- Financial Behavior -->
          <div class="form-section">
            <div class="form-section-title">
              <div class="form-section-icon">💳</div>
              Financial Behavior
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="input-utility">Utility Bill Payment Consistency</label>
                <input class="form-range" type="range" id="input-utility" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-utility">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-mobile">Mobile Recharge Regularity</label>
                <input class="form-range" type="range" id="input-mobile" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-mobile">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-savings">Savings Group Contributions</label>
                <input class="form-range" type="range" id="input-savings" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-savings">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-repayment">SHG Loan Repayment History</label>
                <input class="form-range" type="range" id="input-repayment" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-repayment">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Economic Activity -->
          <div class="form-section">
            <div class="form-section-title">
              <div class="form-section-icon">📊</div>
              Economic Activity
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="input-years-business">Years in Business</label>
                <input class="form-input" type="number" id="input-years-business" min="0" max="40" placeholder="Years" />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-revenue">Monthly Revenue (₹)</label>
                <input class="form-input" type="number" id="input-revenue" min="0" max="500000" placeholder="Estimated monthly revenue" />
              </div>
              <div class="form-group">
                <label class="form-label" for="input-supply">Supply Chain Participation</label>
                <input class="form-range" type="range" id="input-supply" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-supply">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-diversity">Product Diversity</label>
                <select class="form-select" id="input-diversity">
                  <option value="1">1 — Single product</option>
                  <option value="2">2 — Two products</option>
                  <option value="3" selected>3 — Multiple products</option>
                  <option value="4">4 — Diverse range</option>
                  <option value="5">5 — Highly diversified</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-market">Marketplace Activity</label>
                <input class="form-range" type="range" id="input-market" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-market">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Community Trust -->
          <div class="form-section">
            <div class="form-section-title">
              <div class="form-section-icon">🤝</div>
              Community Trust
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="input-attendance">SHG Meeting Attendance</label>
                <input class="form-range" type="range" id="input-attendance" min="0" max="100" value="50" />
                <div class="range-display">
                  <span class="text-sm text-muted">0%</span>
                  <span class="range-value" id="val-attendance">50%</span>
                  <span class="text-sm text-muted">100%</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-vouch">Peer Trust Score</label>
                <input class="form-range" type="range" id="input-vouch" min="0" max="10" value="5" step="0.5" />
                <div class="range-display">
                  <span class="text-sm text-muted">0</span>
                  <span class="range-value" id="val-vouch">5.0</span>
                  <span class="text-sm text-muted">10</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-references">Community References</label>
                <select class="form-select" id="input-references">
                  <option value="0">0 — None</option>
                  <option value="1">1 — One reference</option>
                  <option value="2">2 — Two references</option>
                  <option value="3" selected>3 — Three references</option>
                  <option value="4">4 — Four references</option>
                  <option value="5">5 — Five references</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="input-leader">Leadership Role in SHG/Community</label>
                <select class="form-select" id="input-leader">
                  <option value="false">No — No leadership role</option>
                  <option value="true">Yes — Holds or held leadership position</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Stability -->
          <div class="form-section">
            <div class="form-section-title">
              <div class="form-section-icon">🏠</div>
              Stability
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="input-residence">Years at Current Residence</label>
                <input class="form-input" type="number" id="input-residence" min="0" max="50" placeholder="Years" />
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex justify-center mt-xl" style="gap: var(--space-md);">
            <button type="submit" class="btn btn-accent btn-lg" id="submit-assessment">
              🧠 Generate AI Credit Score
            </button>
          </div>
        </form>
      </div>
    </section>
  `;
}

/**
 * Initialize assess page event listeners
 */
export function initAssess(onScoreGenerated) {
  // Range slider live value display
  const rangeInputs = [
    { id: 'input-utility', valId: 'val-utility', suffix: '%' },
    { id: 'input-mobile', valId: 'val-mobile', suffix: '%' },
    { id: 'input-savings', valId: 'val-savings', suffix: '%' },
    { id: 'input-repayment', valId: 'val-repayment', suffix: '%' },
    { id: 'input-supply', valId: 'val-supply', suffix: '%' },
    { id: 'input-market', valId: 'val-market', suffix: '%' },
    { id: 'input-attendance', valId: 'val-attendance', suffix: '%' },
    { id: 'input-vouch', valId: 'val-vouch', suffix: '' },
  ];

  rangeInputs.forEach(({ id, valId, suffix }) => {
    const input = document.getElementById(id);
    const display = document.getElementById(valId);
    if (input && display) {
      input.addEventListener('input', () => {
        display.textContent = id === 'input-vouch' ? `${parseFloat(input.value).toFixed(1)}` : `${input.value}${suffix}`;
      });
    }
  });

  // Demo profile buttons
  demoProfiles.forEach(profile => {
    const btn = document.getElementById(`profile-btn-${profile.id}`);
    if (btn) {
      btn.addEventListener('click', () => {
        fillProfile(profile.data);
        // Highlight active
        document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    }
  });

  // Form submission
  const form = document.getElementById('assessment-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = collectFormData();
      onScoreGenerated(data);
    });
  }
}

function fillProfile(data) {
  setValue('input-name', data.name);
  setValue('input-age', data.age);
  setValue('input-occupation', data.occupation);
  setValue('input-shg-name', data.shgName);
  setValue('input-shg-years', data.shgMembershipYears);
  setValue('input-dependents', data.dependents);

  setRange('input-utility', data.utilityPaymentConsistency, 'val-utility', '%');
  setRange('input-mobile', data.mobileRechargeRegularity, 'val-mobile', '%');
  setRange('input-savings', data.savingsContribution, 'val-savings', '%');
  setRange('input-repayment', data.loanRepaymentHistory, 'val-repayment', '%');

  setValue('input-years-business', data.yearsInBusiness);
  setValue('input-revenue', data.monthlyRevenue);
  setRange('input-supply', data.supplyChainParticipation, 'val-supply', '%');
  setValue('input-diversity', data.productDiversity);
  setRange('input-market', data.marketplaceActivity, 'val-market', '%');

  setRange('input-attendance', data.shgAttendance, 'val-attendance', '%');
  setRange('input-vouch', data.peerVouchingScore, 'val-vouch', '');
  setValue('input-references', data.communityReferences);
  setValue('input-leader', data.hasLeadershipRole ? 'true' : 'false');

  setValue('input-residence', data.yearsAtResidence);
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function setRange(inputId, value, displayId, suffix) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (input) input.value = value;
  if (display) {
    display.textContent = inputId === 'input-vouch' ? `${parseFloat(value).toFixed(1)}` : `${value}${suffix}`;
  }
}

function collectFormData() {
  return {
    name: document.getElementById('input-name')?.value || 'Applicant',
    age: parseInt(document.getElementById('input-age')?.value) || 30,
    occupation: document.getElementById('input-occupation')?.value || '',
    shgName: document.getElementById('input-shg-name')?.value || '',
    shgMembershipYears: parseInt(document.getElementById('input-shg-years')?.value) || 0,
    dependents: parseInt(document.getElementById('input-dependents')?.value) || 0,

    utilityPaymentConsistency: parseInt(document.getElementById('input-utility')?.value) || 50,
    mobileRechargeRegularity: parseInt(document.getElementById('input-mobile')?.value) || 50,
    savingsContribution: parseInt(document.getElementById('input-savings')?.value) || 50,
    loanRepaymentHistory: parseInt(document.getElementById('input-repayment')?.value) || 50,

    yearsInBusiness: parseInt(document.getElementById('input-years-business')?.value) || 0,
    monthlyRevenue: parseInt(document.getElementById('input-revenue')?.value) || 5000,
    supplyChainParticipation: parseInt(document.getElementById('input-supply')?.value) || 50,
    productDiversity: parseInt(document.getElementById('input-diversity')?.value) || 3,
    marketplaceActivity: parseInt(document.getElementById('input-market')?.value) || 50,

    shgAttendance: parseInt(document.getElementById('input-attendance')?.value) || 50,
    peerVouchingScore: parseFloat(document.getElementById('input-vouch')?.value) || 5,
    communityReferences: parseInt(document.getElementById('input-references')?.value) || 3,
    hasLeadershipRole: document.getElementById('input-leader')?.value === 'true',

    yearsAtResidence: parseInt(document.getElementById('input-residence')?.value) || 5,
  };
}

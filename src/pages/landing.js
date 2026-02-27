/**
 * Landing Page — Hero section with project overview
 */
export function renderLanding() {
  return `
    <section class="page" id="landing-page">
      <div class="container">
        <!-- Hero Section -->
        <div class="hero text-center animate-fade-in-up" style="padding-top: var(--space-3xl);">
          <div class="hero-badge animate-fade-in-up delay-1">
            <span class="badge badge-primary" style="font-size: 0.85rem; padding: 6px 18px;">
              🤖 AI for Good Hackathon 2026
            </span>
          </div>
          <h1 class="mt-lg animate-fade-in-up delay-2" style="max-width: 800px; margin-left: auto; margin-right: auto;">
            Credit Scoring for the
            <span class="text-gradient">Unbanked</span>
          </h1>
          <p style="font-size: 1.15rem; max-width: 650px; margin: var(--space-lg) auto 0;" class="animate-fade-in-up delay-3">
            <strong style="color: var(--text-primary);">SahiScore AI</strong> uses alternative data — utility payments, SHG participation, and community trust — to generate reliable credit scores for women entrepreneurs who lack formal banking histories.
          </p>
          <div class="flex justify-center gap-md mt-xl animate-fade-in-up delay-4">
            <a href="#/assess" class="btn btn-accent btn-lg">
              🚀 Start Assessment
            </a>
            <a href="#/dashboard" class="btn btn-outline btn-lg">
              📊 View Dashboard
            </a>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="stat-grid mt-2xl animate-fade-in-up delay-5" style="margin-top: 80px;">
          <div class="stat-card">
            <div class="stat-value">350M+</div>
            <div class="stat-label">Unbanked Women in India</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">₹1.7T</div>
            <div class="stat-label">Credit Gap for Women MSMEs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">98%</div>
            <div class="stat-label">SHG Loan Repayment Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Formal Credit Scores Available</div>
          </div>
        </div>

        <!-- Problem Section -->
        <div class="mt-2xl animate-fade-in-up delay-6" style="margin-top: 100px;">
          <div class="section-header text-center">
            <h2>The Problem</h2>
            <p style="margin: var(--space-md) auto 0; max-width: 650px;">
              Millions of women entrepreneurs run thriving micro-businesses but cannot access formal credit because they have no banking history, no CIBIL score, and no collateral.
            </p>
          </div>
        </div>

        <!-- Solution Section -->
        <div class="grid-3 mt-xl">
          <div class="card animate-fade-in-up delay-1">
            <div style="font-size: 2.5rem; margin-bottom: var(--space-md);">📊</div>
            <h3>Alternative Data</h3>
            <p class="mt-sm" style="font-size: 0.9rem;">
              We analyze utility payments, mobile recharge patterns, marketplace activity, and SHG records — data points that exist but are never used for credit assessment.
            </p>
          </div>
          <div class="card animate-fade-in-up delay-2">
            <div style="font-size: 2.5rem; margin-bottom: var(--space-md);">🧠</div>
            <h3>Explainable AI</h3>
            <p class="mt-sm" style="font-size: 0.9rem;">
              Every score comes with a clear breakdown showing exactly which factors contributed and how. No black boxes — lenders and applicants both see the reasoning.
            </p>
          </div>
          <div class="card animate-fade-in-up delay-3">
            <div style="font-size: 2.5rem; margin-bottom: var(--space-md);">🛡️</div>
            <h3>Bias-Free Scoring</h3>
            <p class="mt-sm" style="font-size: 0.9rem;">
              Our model explicitly excludes gender, caste, religion, and location from scoring. Only verifiable behavioral and economic data determines creditworthiness.
            </p>
          </div>
        </div>

        <!-- How It Works Section -->
        <div class="mt-2xl" style="margin-top: 100px;">
          <div class="section-header text-center">
            <h2>How It Works</h2>
          </div>
          <div class="grid-2 mt-xl" style="max-width: 900px; margin-left: auto; margin-right: auto;">
            <div class="card-glass animate-fade-in-up delay-1" style="text-align: center; padding: var(--space-2xl);">
              <div style="font-size: 2rem; margin-bottom: var(--space-md); width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-md);">1</div>
              <h4>Field Worker Collects Data</h4>
              <p class="mt-sm text-sm">Visits the applicant, documents alternative data via mobile-friendly form.</p>
            </div>
            <div class="card-glass animate-fade-in-up delay-2" style="text-align: center; padding: var(--space-2xl);">
              <div style="font-size: 2rem; margin-bottom: var(--space-md); width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-md);">2</div>
              <h4>AI Generates Credit Score</h4>
              <p class="mt-sm text-sm">Weighted model evaluates financial behavior, economic activity, community trust, and stability.</p>
            </div>
            <div class="card-glass animate-fade-in-up delay-3" style="text-align: center; padding: var(--space-2xl);">
              <div style="font-size: 2rem; margin-bottom: var(--space-md); width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-md);">3</div>
              <h4>Explainable Breakdown</h4>
              <p class="mt-sm text-sm">Each factor's contribution is shown transparently — no black-box decisions.</p>
            </div>
            <div class="card-glass animate-fade-in-up delay-4" style="text-align: center; padding: var(--space-2xl);">
              <div style="font-size: 2rem; margin-bottom: var(--space-md); width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-md);">4</div>
              <h4>Loan Decision</h4>
              <p class="mt-sm text-sm">MFI officer reviews the score, eligibility, and recommendations on the dashboard.</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-2xl animate-fade-in-up" style="margin-top: 80px; padding-bottom: var(--space-3xl);">
          <h2>Ready to Transform Financial Inclusion?</h2>
          <p class="mt-md" style="max-width: 500px; margin-left: auto; margin-right: auto;">
            Try our prototype with pre-built demo profiles of real-world personas.
          </p>
          <a href="#/assess" class="btn btn-primary btn-lg mt-lg">
            Try Demo Profiles →
          </a>
        </div>
      </div>
    </section>
  `;
}

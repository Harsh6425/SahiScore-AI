/**
 * SahiScore AI — Credit Scoring Engine
 *
 * Simulated ML model using weighted factor scoring across 4 categories.
 * Produces a score 300-900, risk category, and per-factor explainability.
 * Includes bias safeguards — no penalty for gender, caste, location.
 */

// Category weights (must sum to 1.0)
const CATEGORY_WEIGHTS = {
  financialBehavior: 0.35,
  economicActivity: 0.3,
  communityTrust: 0.25,
  stability: 0.1,
};

// Score range
const MIN_SCORE = 300;
const MAX_SCORE = 900;
const SCORE_RANGE = MAX_SCORE - MIN_SCORE;

/**
 * Normalize a value to 0-1 range
 */
function normalize(value, min, max) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Calculate Financial Behavior sub-score (0-1)
 */
function scoreFinancialBehavior(data) {
  const factors = [];

  // Utility bill payment consistency (0-100%)
  const utilityScore = (data.utilityPaymentConsistency || 0) / 100;
  factors.push({
    name: "Utility Bill Payments",
    score: utilityScore,
    weight: 0.35,
    description: "Consistency of utility bill payments over last 12 months",
  });

  // Mobile recharge regularity (0-100%)
  const mobileScore = (data.mobileRechargeRegularity || 0) / 100;
  factors.push({
    name: "Mobile Recharge Pattern",
    score: mobileScore,
    weight: 0.2,
    description: "Regularity and consistency of mobile recharge patterns",
  });

  // Savings group contributions (0-100%)
  const savingsScore = (data.savingsContribution || 0) / 100;
  factors.push({
    name: "Savings Contributions",
    score: savingsScore,
    weight: 0.3,
    description: "Regularity of contributions to SHG savings pool",
  });

  // Loan repayment history within SHG (0-100%)
  const repaymentScore = (data.loanRepaymentHistory || 0) / 100;
  factors.push({
    name: "SHG Loan Repayment",
    score: repaymentScore,
    weight: 0.15,
    description: "History of repaying internal SHG loans on time",
  });

  const categoryScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  return { categoryScore, factors };
}

/**
 * Calculate Economic Activity sub-score (0-1)
 */
function scoreEconomicActivity(data) {
  const factors = [];

  // Years in business
  const yearsScore = normalize(data.yearsInBusiness || 0, 0, 15);
  factors.push({
    name: "Business Experience",
    score: yearsScore,
    weight: 0.2,
    description: "Years of experience in current business or trade",
  });

  // Monthly revenue (normalized against typical range for micro-enterprises)
  const revenueScore = normalize(data.monthlyRevenue || 0, 0, 25000);
  factors.push({
    name: "Monthly Revenue",
    score: revenueScore,
    weight: 0.25,
    description: "Estimated monthly revenue from business activities",
  });

  // Supply chain participation (0-100%)
  const supplyScore = (data.supplyChainParticipation || 0) / 100;
  factors.push({
    name: "Supply Chain Activity",
    score: supplyScore,
    weight: 0.25,
    description: "Active participation in local supply chains and markets",
  });

  // Product diversity (1-5 product types)
  const diversityScore = normalize(data.productDiversity || 1, 1, 5);
  factors.push({
    name: "Product Diversity",
    score: diversityScore,
    weight: 0.15,
    description: "Range of products or services offered",
  });

  // Marketplace activity (0-100%)
  const marketScore = (data.marketplaceActivity || 0) / 100;
  factors.push({
    name: "Market Presence",
    score: marketScore,
    weight: 0.15,
    description: "Activity in local marketplaces and haats",
  });

  const categoryScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  return { categoryScore, factors };
}

/**
 * Calculate Community Trust sub-score (0-1)
 */
function scoreCommunityTrust(data) {
  const factors = [];

  // SHG meeting attendance (0-100%)
  const attendanceScore = (data.shgAttendance || 0) / 100;
  factors.push({
    name: "SHG Attendance",
    score: attendanceScore,
    weight: 0.3,
    description: "Attendance at Self-Help Group meetings",
  });

  // Peer vouching / trust score (0-10)
  const vouchScore = normalize(data.peerVouchingScore || 0, 0, 10);
  factors.push({
    name: "Peer Trust Score",
    score: vouchScore,
    weight: 0.35,
    description: "Trust rating from fellow SHG members",
  });

  // Community references (0-5)
  const refScore = normalize(data.communityReferences || 0, 0, 5);
  factors.push({
    name: "Community References",
    score: refScore,
    weight: 0.2,
    description: "Number of positive community references",
  });

  // Leadership roles (boolean, bonus)
  const leaderScore = data.hasLeadershipRole ? 1 : 0;
  factors.push({
    name: "Leadership Role",
    score: leaderScore,
    weight: 0.15,
    description: "Holds or has held leadership position in SHG/community",
  });

  const categoryScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  return { categoryScore, factors };
}

/**
 * Calculate Stability sub-score (0-1)
 */
function scoreStability(data) {
  const factors = [];

  // Years at current residence
  const residenceScore = normalize(data.yearsAtResidence || 0, 0, 20);
  factors.push({
    name: "Residential Stability",
    score: residenceScore,
    weight: 0.4,
    description: "Duration at current residence indicates stability",
  });

  // SHG membership duration
  const membershipScore = normalize(data.shgMembershipYears || 0, 0, 10);
  factors.push({
    name: "SHG Membership",
    score: membershipScore,
    weight: 0.35,
    description: "Years of active SHG membership",
  });

  // Dependents (normalized — moderate is optimal)
  const depNorm = data.dependents || 0;
  const depScore =
    depNorm <= 3
      ? 0.8 + depNorm * 0.05
      : Math.max(0.3, 1 - (depNorm - 3) * 0.1);
  factors.push({
    name: "Family Stability",
    score: depScore,
    weight: 0.25,
    description: "Family situation and number of dependents",
  });

  const categoryScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

  return { categoryScore, factors };
}

/**
 * Get risk category from score
 */
function getRiskCategory(score) {
  if (score >= 720)
    return {
      level: "Low",
      color: "#10b981",
      label: "Low Risk — Recommended for approval",
    };
  if (score >= 580)
    return {
      level: "Medium",
      color: "#f59e0b",
      label: "Medium Risk — Conditional approval",
    };
  return {
    level: "High",
    color: "#ef4444",
    label: "High Risk — Further review needed",
  };
}

/**
 * Get loan eligibility based on score
 */
function getLoanEligibility(score, monthlyRevenue) {
  const revenue = monthlyRevenue || 5000;

  if (score >= 720) {
    return {
      eligible: true,
      maxAmount: Math.min(revenue * 10, 100000),
      interestRate: "12-14%",
      tenure: "Up to 24 months",
      recommendation:
        "Strong candidate for micro-loan. Low default probability.",
    };
  }
  if (score >= 580) {
    return {
      eligible: true,
      maxAmount: Math.min(revenue * 5, 50000),
      interestRate: "15-18%",
      tenure: "Up to 12 months",
      recommendation:
        "Eligible with conditions. Consider group guarantee from SHG.",
    };
  }
  return {
    eligible: false,
    maxAmount: Math.min(revenue * 2, 15000),
    interestRate: "20-24%",
    tenure: "Up to 6 months",
    recommendation:
      "Consider capacity building first. Small initial loan with SHG co-guarantee.",
  };
}

/**
 * Generate improvement recommendations based on weak factors
 */
function getRecommendations(allFactors) {
  const weakFactors = allFactors
    .filter((f) => f.score < 0.6)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);

  const recommendations = [];

  for (const factor of weakFactors) {
    switch (factor.name) {
      case "Utility Bill Payments":
        recommendations.push({
          icon: "💡",
          text: "Ensure timely utility bill payments for the next 3-6 months to strengthen financial track record.",
        });
        break;
      case "Mobile Recharge Pattern":
        recommendations.push({
          icon: "📱",
          text: "Maintain a regular mobile recharge schedule to demonstrate consistent financial behavior.",
        });
        break;
      case "Savings Contributions":
        recommendations.push({
          icon: "💰",
          text: "Increase regularity of SHG savings contributions — even small amounts help build credibility.",
        });
        break;
      case "SHG Loan Repayment":
        recommendations.push({
          icon: "✅",
          text: "Prioritize on-time repayment of existing SHG loans to build a positive repayment history.",
        });
        break;
      case "Business Experience":
        recommendations.push({
          icon: "📈",
          text: "Document years of experience in trade or craftsmanship. Informal experience also counts.",
        });
        break;
      case "Monthly Revenue":
        recommendations.push({
          icon: "🏪",
          text: "Maintain records of sales and revenue. Simple bookkeeping can significantly improve score.",
        });
        break;
      case "Supply Chain Activity":
        recommendations.push({
          icon: "🔗",
          text: "Strengthen connections with local suppliers and buyers. Participate in mandi trading.",
        });
        break;
      case "SHG Attendance":
        recommendations.push({
          icon: "👥",
          text: "Improve attendance at SHG meetings — this is a key trust indicator for lenders.",
        });
        break;
      case "Peer Trust Score":
        recommendations.push({
          icon: "🤝",
          text: "Build trust within SHG by supporting other members and participating in group activities.",
        });
        break;
      case "Community References":
        recommendations.push({
          icon: "📝",
          text: "Obtain references from community leaders, teachers, or local shop owners.",
        });
        break;
      case "Market Presence":
        recommendations.push({
          icon: "🛒",
          text: "Increase participation in local markets and haats to demonstrate active business engagement.",
        });
        break;
      default:
        recommendations.push({
          icon: "⬆️",
          text: `Improving "${factor.name}" would positively impact your credit score.`,
        });
    }
  }

  if (recommendations.length === 0) {
    recommendations.push({
      icon: "⭐",
      text: "Excellent profile! Continue maintaining current financial habits and community engagement.",
    });
  }

  return recommendations;
}

/**
 * Main scoring function — takes applicant data, returns full score report
 */
export function calculateCreditScore(data) {
  // Calculate category scores
  const financial = scoreFinancialBehavior(data);
  const economic = scoreEconomicActivity(data);
  const community = scoreCommunityTrust(data);
  const stability = scoreStability(data);

  // Weighted composite
  const compositeScore =
    financial.categoryScore * CATEGORY_WEIGHTS.financialBehavior +
    economic.categoryScore * CATEGORY_WEIGHTS.economicActivity +
    community.categoryScore * CATEGORY_WEIGHTS.communityTrust +
    stability.categoryScore * CATEGORY_WEIGHTS.stability;

  // Map to 300-900 range
  const creditScore = Math.round(MIN_SCORE + compositeScore * SCORE_RANGE);

  // Get risk category
  const risk = getRiskCategory(creditScore);

  // All factors with weighted contributions for explainability
  const allFactors = [
    ...financial.factors.map((f) => ({
      ...f,
      category: "Financial Behavior",
      categoryWeight: CATEGORY_WEIGHTS.financialBehavior,
    })),
    ...economic.factors.map((f) => ({
      ...f,
      category: "Economic Activity",
      categoryWeight: CATEGORY_WEIGHTS.economicActivity,
    })),
    ...community.factors.map((f) => ({
      ...f,
      category: "Community Trust",
      categoryWeight: CATEGORY_WEIGHTS.communityTrust,
    })),
    ...stability.factors.map((f) => ({
      ...f,
      category: "Stability",
      categoryWeight: CATEGORY_WEIGHTS.stability,
    })),
  ];

  // Calculate contribution of each factor to the final score
  const factorContributions = allFactors.map((f) => ({
    ...f,
    contribution: Math.round(
      f.score * f.weight * f.categoryWeight * SCORE_RANGE,
    ),
    maxContribution: Math.round(f.weight * f.categoryWeight * SCORE_RANGE),
  }));

  // Category breakdowns
  const categories = [
    {
      name: "Financial Behavior",
      score: financial.categoryScore,
      weight: CATEGORY_WEIGHTS.financialBehavior,
      icon: "💳",
      factors: financial.factors,
    },
    {
      name: "Economic Activity",
      score: economic.categoryScore,
      weight: CATEGORY_WEIGHTS.economicActivity,
      icon: "📊",
      factors: economic.factors,
    },
    {
      name: "Community Trust",
      score: community.categoryScore,
      weight: CATEGORY_WEIGHTS.communityTrust,
      icon: "🤝",
      factors: community.factors,
    },
    {
      name: "Stability",
      score: stability.categoryScore,
      weight: CATEGORY_WEIGHTS.stability,
      icon: "🏠",
      factors: stability.factors,
    },
  ];

  // Loan eligibility
  const eligibility = getLoanEligibility(creditScore, data.monthlyRevenue);

  // Recommendations
  const recommendations = getRecommendations(allFactors);

  // Bias transparency note
  const biasNote =
    "This score is calculated without considering gender, caste, religion, ethnicity, or geographic location. Only verifiable behavioral and economic data is used.";

  return {
    score: creditScore,
    risk,
    categories,
    factorContributions,
    eligibility,
    recommendations,
    biasNote,
    compositeScore,
    applicantName: data.name || "Applicant",
  };
}

export const X_REWARDS_THRESHOLDS = Object.freeze({
  verifiedHomeTimelineImpressions: 500_000,
  verifiedFollowers: 500,
  rollingDays: 90,
});

export function calculateXRewardsEstimate({
  totalImpressions,
  qualificationRate,
  payoutPerThousand,
  verifiedHomeTimelineImpressions = 0,
  verifiedFollowers = 0,
}) {
  const impressions = Number(totalImpressions);
  const qualification = Number(qualificationRate);
  const rate = Number(payoutPerThousand);
  const verifiedImpressions = Number(verifiedHomeTimelineImpressions);
  const followers = Number(verifiedFollowers);

  if (!Number.isFinite(impressions) || impressions < 0) {
    throw new RangeError("Total impressions must be a non-negative number.");
  }
  if (!Number.isFinite(qualification) || qualification < 0 || qualification > 100) {
    throw new RangeError("Qualification rate must be between 0 and 100.");
  }
  if (!Number.isFinite(rate) || rate < 0) {
    throw new RangeError("Payout rate must be a non-negative number.");
  }
  if (!Number.isFinite(verifiedImpressions) || verifiedImpressions < 0) {
    throw new RangeError("Verified Home Timeline impressions must be a non-negative number.");
  }
  if (!Number.isFinite(followers) || followers < 0) {
    throw new RangeError("Verified followers must be a non-negative number.");
  }

  const qualifiedImpressions = Math.floor(impressions * qualification / 100);
  const estimatedPayout = qualifiedImpressions / 1000 * rate;
  const impressionsProgress = Math.min(
    verifiedImpressions / X_REWARDS_THRESHOLDS.verifiedHomeTimelineImpressions * 100,
    100,
  );
  const followersProgress = Math.min(followers / X_REWARDS_THRESHOLDS.verifiedFollowers * 100, 100);

  return {
    totalImpressions: impressions,
    qualificationRate: qualification,
    qualifiedImpressions,
    payoutPerThousand: rate,
    estimatedPayout,
    verifiedHomeTimelineImpressions: verifiedImpressions,
    impressionsProgress,
    followersProgress,
    meetsImpressionsThreshold: verifiedImpressions >= X_REWARDS_THRESHOLDS.verifiedHomeTimelineImpressions,
    meetsFollowersThreshold: followers >= X_REWARDS_THRESHOLDS.verifiedFollowers,
    meetsPublishedThresholds:
      verifiedImpressions >= X_REWARDS_THRESHOLDS.verifiedHomeTimelineImpressions &&
      followers >= X_REWARDS_THRESHOLDS.verifiedFollowers,
    remainingVerifiedHomeTimelineImpressions: Math.max(
      0,
      X_REWARDS_THRESHOLDS.verifiedHomeTimelineImpressions - verifiedImpressions,
    ),
    remainingVerifiedFollowers: Math.max(0, X_REWARDS_THRESHOLDS.verifiedFollowers - followers),
  };
}

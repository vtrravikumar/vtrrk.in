import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateXRewardsEstimate,
  X_REWARDS_THRESHOLDS,
} from "../src/utils/x-rewards-calculator.mjs";

test("calculates qualified impressions separately from verified Home Timeline eligibility impressions", () => {
  const result = calculateXRewardsEstimate({
    totalImpressions: 1_000_000,
    qualificationRate: 12.5,
    payoutPerThousand: 1.28,
    verifiedHomeTimelineImpressions: 400_000,
    verifiedFollowers: 600,
  });
  assert.equal(result.qualifiedImpressions, 125_000);
  assert.equal(result.estimatedPayout, 160);
  assert.equal(result.meetsImpressionsThreshold, false);
  assert.equal(result.meetsFollowersThreshold, true);
  assert.equal(result.remainingVerifiedHomeTimelineImpressions, 100_000);
});

test("caps eligibility progress at 100 percent", () => {
  const result = calculateXRewardsEstimate({
    totalImpressions: 10_000_000,
    qualificationRate: 10,
    payoutPerThousand: 0.38,
    verifiedHomeTimelineImpressions: 900_000,
    verifiedFollowers: 900,
  });
  assert.equal(result.impressionsProgress, 100);
  assert.equal(result.followersProgress, 100);
  assert.equal(result.meetsPublishedThresholds, true);
});

test("uses floor for fractional qualified impression estimates", () => {
  const result = calculateXRewardsEstimate({
    totalImpressions: 101,
    qualificationRate: 33.3,
    payoutPerThousand: 2.03,
    verifiedHomeTimelineImpressions: 100,
  });
  assert.equal(result.qualifiedImpressions, 33);
});

test("zero qualification produces zero qualified impressions and payout", () => {
  const result = calculateXRewardsEstimate({
    totalImpressions: 2_000_000,
    qualificationRate: 0,
    payoutPerThousand: 1,
    verifiedHomeTimelineImpressions: 300_000,
  });
  assert.equal(result.qualifiedImpressions, 0);
  assert.equal(result.estimatedPayout, 0);
  assert.equal(result.impressionsProgress, 60);
});

test("exposes the published 90-day thresholds", () => {
  assert.deepEqual(X_REWARDS_THRESHOLDS, {
    verifiedHomeTimelineImpressions: 500_000,
    verifiedFollowers: 500,
    rollingDays: 90,
  });
});

test("rejects invalid calculator inputs", () => {
  assert.throws(() => calculateXRewardsEstimate({
    totalImpressions: -1, qualificationRate: 10, payoutPerThousand: 1,
  }), RangeError);
  assert.throws(() => calculateXRewardsEstimate({
    totalImpressions: 100, qualificationRate: 101, payoutPerThousand: 1,
  }), RangeError);
  assert.throws(() => calculateXRewardsEstimate({
    totalImpressions: 100, qualificationRate: 10, payoutPerThousand: -1,
  }), RangeError);
  assert.throws(() => calculateXRewardsEstimate({
    totalImpressions: 100, qualificationRate: 10, payoutPerThousand: 1,
    verifiedHomeTimelineImpressions: -2,
  }), RangeError);
});

import { useState } from 'react';

// 店表示順のスコア計算
export function calculateTotalScore(
    distance: number,
    priceRange: number,
    review: number,
    weights: { distance: number; priceRange: number; review: number } = { distance: 1, priceRange: 1, review: 1 }
): number {
    // 重み付けされたスコアを計算
    const priceScore = (10 - 2 * Math.abs(3 - priceRange)) * weights.priceRange;
    const reviewScore = (review * 2) * weights.review;
    const distanceScore = ((1000 - distance) * 0.01) * weights.distance;

    // スコアの合計を計算
    const rawTotal = priceScore + reviewScore + distanceScore;

    // 合計スコアを30点満点で正規化
    const maxScore = 30;
    const normalizedTotal = (rawTotal / (weights.distance + weights.priceRange + weights.review)) * maxScore;

    return normalizedTotal;
}

export const handleWeightChange = (type: 'distance' | 'priceRange' | 'review') => {
    const [weights, setWeights] = useState<{ distance: number; priceRange: number; review: number }>({
        distance: 1,
        priceRange: 1,
        review: 1,
    });

    // ここで重みづけのロジックを実装
    // 例: distanceを重視する場合は、他の値を減らす
    const newWeights = {
        distance: type === 'distance' ? 3 : 1,
        priceRange: type === 'priceRange' ? 3 : 1,
        review: type === 'review' ? 3 : 1,
    };

    setWeights(newWeights);
};

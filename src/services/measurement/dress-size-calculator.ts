/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Dress Size Calculator Service
 * Calculates dress sizes based on body measurements
 */

import {
  type RawMeasurements,
  type DressSize,
  MeasurementError,
} from './types';
import {
  DRESS_SIZE_CHART,
  MEASUREMENT_ERROR_CODES,
} from './config';

interface SizeMatch {
  size: string;
  measurements: {
    bust: number;
    waist: number;
    hip: number;
  };
  score: number; // Lower is better
  differences: {
    bust: number;
    waist: number;
    hip: number;
  };
}

export class DressSizeCalculatorService {
  /**
   * Calculate dress size from measurements
   */
  calculateDressSize(measurements: RawMeasurements): DressSize {
    try {
      const usSize = this._findBestSize(measurements, DRESS_SIZE_CHART.US);
      const ukSize = this._findBestSize(measurements, DRESS_SIZE_CHART.UK);
      const euSize = this._findBestSize(measurements, DRESS_SIZE_CHART.EU);

      return {
        us: usSize.size,
        uk: ukSize.size,
        eu: euSize.size,
        measurements: {
          bust: measurements.bustCircumference,
          waist: measurements.waistCircumference,
          hip: measurements.hipCircumference,
        },
      };
    } catch (error: any) {
      throw new MeasurementError(
        `Dress size calculation failed: ${error.message}`,
        MEASUREMENT_ERROR_CODES.CALCULATION_ERROR,
        error
      );
    }
  }

  /**
   * Find the best fitting size from a size chart
   */
  private _findBestSize(
    measurements: RawMeasurements,
    sizeChart: Record<string, { bust: number; waist: number; hip: number }>
  ): SizeMatch {
    const userMeasurements = {
      bust: measurements.bustCircumference,
      waist: measurements.waistCircumference,
      hip: measurements.hipCircumference,
    };

    let bestMatch: SizeMatch | null = null;
    let bestScore = Infinity;

    for (const [size, chartMeasurements] of Object.entries(sizeChart)) {
      const score = this._calculateSizeScore(userMeasurements, chartMeasurements);
      
      if (score < bestScore) {
        bestScore = score;
        bestMatch = {
          size,
          measurements: chartMeasurements,
          score,
          differences: {
            bust: userMeasurements.bust - chartMeasurements.bust,
            waist: userMeasurements.waist - chartMeasurements.waist,
            hip: userMeasurements.hip - chartMeasurements.hip,
          },
        };
      }
    }

    if (!bestMatch) {
      throw new Error('No matching size found in chart');
    }

    return bestMatch;
  }

  /**
   * Calculate how well measurements match a size (lower score = better match)
   */
  private _calculateSizeScore(
    userMeasurements: { bust: number; waist: number; hip: number },
    chartMeasurements: { bust: number; waist: number; hip: number }
  ): number {
    // Calculate weighted differences
    const bustDiff = Math.abs(userMeasurements.bust - chartMeasurements.bust);
    const waistDiff = Math.abs(userMeasurements.waist - chartMeasurements.waist);
    const hipDiff = Math.abs(userMeasurements.hip - chartMeasurements.hip);

    // Weight the differences (bust and hip are more important for fit)
    const bustWeight = 0.4;
    const waistWeight = 0.3;
    const hipWeight = 0.3;

    return (bustDiff * bustWeight) + (waistDiff * waistWeight) + (hipDiff * hipWeight);
  }

  /**
   * Get size recommendations with confidence scores
   */
  getSizeRecommendations(measurements: RawMeasurements): {
    us: SizeMatch[];
    uk: SizeMatch[];
    eu: SizeMatch[];
  } {
    const usMatches = this._getAllSizeMatches(measurements, DRESS_SIZE_CHART.US);
    const ukMatches = this._getAllSizeMatches(measurements, DRESS_SIZE_CHART.UK);
    const euMatches = this._getAllSizeMatches(measurements, DRESS_SIZE_CHART.EU);

    return {
      us: usMatches.slice(0, 3), // Top 3 recommendations
      uk: ukMatches.slice(0, 3),
      eu: euMatches.slice(0, 3),
    };
  }

  /**
   * Get all size matches sorted by score
   */
  private _getAllSizeMatches(
    measurements: RawMeasurements,
    sizeChart: Record<string, { bust: number; waist: number; hip: number }>
  ): SizeMatch[] {
    const userMeasurements = {
      bust: measurements.bustCircumference,
      waist: measurements.waistCircumference,
      hip: measurements.hipCircumference,
    };

    const matches: SizeMatch[] = [];

    for (const [size, chartMeasurements] of Object.entries(sizeChart)) {
      const score = this._calculateSizeScore(userMeasurements, chartMeasurements);
      
      matches.push({
        size,
        measurements: chartMeasurements,
        score,
        differences: {
          bust: userMeasurements.bust - chartMeasurements.bust,
          waist: userMeasurements.waist - chartMeasurements.waist,
          hip: userMeasurements.hip - chartMeasurements.hip,
        },
      });
    }

    return matches.sort((a, b) => a.score - b.score);
  }

  /**
   * Determine if measurements are between sizes
   */
  isBetweenSizes(
    measurements: RawMeasurements,
    region: 'US' | 'UK' | 'EU' = 'US'
  ): {
    isBetween: boolean;
    smallerSize?: string;
    largerSize?: string;
    recommendation: 'size_up' | 'size_down' | 'best_fit';
  } {
    const sizeChart = region === 'US' ? DRESS_SIZE_CHART.US : 
                     region === 'UK' ? DRESS_SIZE_CHART.UK : 
                     DRESS_SIZE_CHART.EU;

    const matches = this._getAllSizeMatches(measurements, sizeChart);
    const bestMatch = matches[0];
    const secondBest = matches[1];

    if (!bestMatch || !secondBest) {
      return { isBetween: false, recommendation: 'best_fit' };
    }

    // Check if the score difference is small (indicating between sizes)
    const scoreDifference = secondBest.score - bestMatch.score;
    const isClose = scoreDifference < 2.0; // Threshold for "close" sizes

    if (isClose) {
      // Determine if user should size up or down based on differences
      const avgDifference = (
        bestMatch.differences.bust + 
        bestMatch.differences.waist + 
        bestMatch.differences.hip
      ) / 3;

      const recommendation = avgDifference > 0 ? 'size_up' : 'size_down';

      return {
        isBetween: true,
        smallerSize: avgDifference > 0 ? bestMatch.size : secondBest.size,
        largerSize: avgDifference > 0 ? secondBest.size : bestMatch.size,
        recommendation,
      };
    }

    return { isBetween: false, recommendation: 'best_fit' };
  }

  /**
   * Get fit analysis for a specific size
   */
  analyzeFit(
    measurements: RawMeasurements,
    size: string,
    region: 'US' | 'UK' | 'EU' = 'US'
  ): {
    fit: 'tight' | 'perfect' | 'loose';
    details: {
      bust: 'tight' | 'perfect' | 'loose';
      waist: 'tight' | 'perfect' | 'loose';
      hip: 'tight' | 'perfect' | 'loose';
    };
    differences: {
      bust: number;
      waist: number;
      hip: number;
    };
  } {
    const sizeChart = region === 'US' ? DRESS_SIZE_CHART.US : 
                     region === 'UK' ? DRESS_SIZE_CHART.UK : 
                     DRESS_SIZE_CHART.EU;

    const chartMeasurements = sizeChart[size as keyof typeof sizeChart] as { bust: number; waist: number; hip: number };
    if (!chartMeasurements) {
      throw new Error(`Size ${size} not found in ${region} chart`);
    }

    const differences = {
      bust: measurements.bustCircumference - chartMeasurements.bust,
      waist: measurements.waistCircumference - chartMeasurements.waist,
      hip: measurements.hipCircumference - chartMeasurements.hip,
    };

    const analyzeFitDifference = (diff: number): 'tight' | 'perfect' | 'loose' => {
      if (diff < -3) return 'tight';
      if (diff > 3) return 'loose';
      return 'perfect';
    };

    const details = {
      bust: analyzeFitDifference(differences.bust),
      waist: analyzeFitDifference(differences.waist),
      hip: analyzeFitDifference(differences.hip),
    };

    // Overall fit is the most restrictive
    let fit: 'tight' | 'perfect' | 'loose' = 'perfect';
    if (details.bust === 'tight' || details.waist === 'tight' || details.hip === 'tight') {
      fit = 'tight';
    } else if (details.bust === 'loose' && details.waist === 'loose' && details.hip === 'loose') {
      fit = 'loose';
    }

    return { fit, details, differences };
  }

  /**
   * Convert between size systems
   */
  convertSize(size: string, fromRegion: 'US' | 'UK' | 'EU', toRegion: 'US' | 'UK' | 'EU'): string | null {
    if (fromRegion === toRegion) return size;

    const fromChart = fromRegion === 'US' ? DRESS_SIZE_CHART.US : 
                     fromRegion === 'UK' ? DRESS_SIZE_CHART.UK : 
                     DRESS_SIZE_CHART.EU;

    const toChart = toRegion === 'US' ? DRESS_SIZE_CHART.US : 
                   toRegion === 'UK' ? DRESS_SIZE_CHART.UK : 
                   DRESS_SIZE_CHART.EU;

    const sourceMeasurements = fromChart[size as keyof typeof fromChart] as { bust: number; waist: number; hip: number };
    if (!sourceMeasurements) return null;

    // Find the closest match in the target chart
    let bestMatch: string | null = null;
    let bestScore = Infinity;

    for (const [targetSize, targetMeasurements] of Object.entries(toChart)) {
      const score = this._calculateSizeScore(sourceMeasurements, targetMeasurements);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = targetSize;
      }
    }

    return bestMatch;
  }

  /**
   * Get size range that would fit the measurements
   */
  getSizeRange(
    measurements: RawMeasurements,
    region: 'US' | 'UK' | 'EU' = 'US',
    tolerance = 3 // cm tolerance
  ): string[] {
    const sizeChart = region === 'US' ? DRESS_SIZE_CHART.US : 
                     region === 'UK' ? DRESS_SIZE_CHART.UK : 
                     DRESS_SIZE_CHART.EU;

    const userMeasurements = {
      bust: measurements.bustCircumference,
      waist: measurements.waistCircumference,
      hip: measurements.hipCircumference,
    };

    const fittingSizes: string[] = [];

    for (const [size, chartMeasurements] of Object.entries(sizeChart)) {
      const bustFits = Math.abs(userMeasurements.bust - chartMeasurements.bust) <= tolerance;
      const waistFits = Math.abs(userMeasurements.waist - chartMeasurements.waist) <= tolerance;
      const hipFits = Math.abs(userMeasurements.hip - chartMeasurements.hip) <= tolerance;

      // Size fits if at least 2 out of 3 measurements are within tolerance
      const fittingCount = [bustFits, waistFits, hipFits].filter(Boolean).length;
      if (fittingCount >= 2) {
        fittingSizes.push(size);
      }
    }

    return fittingSizes.sort((a, b) => {
      // Sort by numeric value for proper ordering
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });
  }
}

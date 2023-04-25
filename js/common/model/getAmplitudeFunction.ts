// Copyright 2021-2023, University of Colorado Boulder

/**
 * getAmplitudeFunction returns a function that can be used to compute amplitude for a specific Domain (space, time,
 * space & time) and series type (sin, cos).  All of these functions have identical signature, as documented below.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

/**
 * @param A - the harmonic's amplitude, unitless
 * @param n - the harmonic's order
 * @param x - x-axis coordinate, whose semantics depend on the domain of the function
 * @param t - the current time, in milliseconds
 * @param L - the harmonic's wavelength, in meters
 * @param T - the harmonic's period, in milliseconds
 * @returns y value (amplitude) at x
 */
type AmplitudeFunction = ( A: number, n: number, x: number, t: number, L: number, T: number ) => number;

/**
 * Gets the function that computes amplitude at an x value.
 */
export default function getAmplitudeFunction( domain: Domain, seriesType: SeriesType ): AmplitudeFunction {
  let f;
  if ( domain === Domain.SPACE ) {
    f = ( seriesType === SeriesType.SIN ) ? getAmplitudeSpaceSine : getAmplitudeSpaceCosine;
  }
  else if ( domain === Domain.TIME ) {
    f = ( seriesType === SeriesType.SIN ) ? getAmplitudeTimeSine : getAmplitudeTimeCosine;
  }
  else if ( Domain.SPACE_AND_TIME ) {
    f = ( seriesType === SeriesType.SIN ) ? getAmplitudeSpaceAndTimeSine : getAmplitudeSpaceAndTimeCosine;
  }
  else {
    throw new Error( `unsupported domain: ${domain}` );
  }
  return f;
}

// Domain.SPACE, SeriesType.SIN
function getAmplitudeSpaceSine( A: number, n: number, x: number, t: number, L: number, T: number ): number {
  return A * Math.sin( 2 * Math.PI * n * x / L );
}

// Domain.SPACE, SeriesType.COS
function getAmplitudeSpaceCosine( A: number, n: number, x: number, t: number, L: number, T: number ): number {
  return A * Math.cos( 2 * Math.PI * n * x / L );
}

// Domain.TIME, SeriesType.SIN
function getAmplitudeTimeSine( A: number, n: number, x: number, t: number, L: number, T: number ): number {
  return A * Math.sin( 2 * Math.PI * n * x / T );
}

// Domain.TIME, SeriesType.COS
function getAmplitudeTimeCosine( A: number, n: number, x: number, t: number, L: number, T: number ): number {
  return A * Math.cos( 2 * Math.PI * n * x / T );
}

// Domain.SPACE_AND_TIME, SeriesType.SIN
function getAmplitudeSpaceAndTimeSine( A: number, n: number, x: number, t: number, L: number, T: number ): number {
  return A * Math.sin( 2 * Math.PI * n * ( x / L - t / T ) );
}

// Domain.SPACE_AND_TIME, SeriesType.COS
function getAmplitudeSpaceAndTimeCosine( A: number, n: number, x: number, t: number, L: number, T: number ): number {
  return A * Math.cos( 2 * Math.PI * n * ( x / L - t / T ) );
}

fourierMakingWaves.register( 'getAmplitudeFunction', getAmplitudeFunction );
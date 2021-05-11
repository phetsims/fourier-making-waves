// Copyright 2021, University of Colorado Boulder

/**
 * getAmplitudeFunction returns a function that can be used to compute amplitude for a specific domain (space, time,
 * space & time) and series type (sin, cos).  All of these functions have identical signature, as documented below.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

/**
 * Gets the function that computes amplitude at an x value.
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @returns {function(x:number, t:number, L:number, T:number, order:number, amplitude:number):number}
 * @public
 */
function getAmplitudeFunction( domain, seriesType ) {

  assert && assert( Domain.includes( domain ), 'invalid domain' );
  assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );

  let f;
  if ( domain === Domain.SPACE ) {
    f = ( seriesType === SeriesType.SINE ) ? getAmplitudeSpaceSine : getAmplitudeSpaceCosine;
  }
  else if ( domain === Domain.TIME ) {
    f = ( seriesType === SeriesType.SINE ) ? getAmplitudeTimeSine : getAmplitudeTimeCosine;
  }
  else if ( Domain.SPACE_AND_TIME ) {
    f = ( seriesType === SeriesType.SINE ) ? getAmplitudeSpaceAndTimeSine : getAmplitudeSpaceAndTimeCosine;
  }
  else {
    throw new Error( `unsupported domain: ${domain}` );
  }
  return f;
}

/**
 * These 6 functions all have the same signature, and use the equation that corresponds to EquationForm.MODE.
 * @param {number} x - x-axis coordinate, whose semantics depend on the domain of the function
 * @param {number} t - the current time, in milliseconds
 * @param {number} L - the harmonic's wavelength, in meters
 * @param {number} T - the harmonic's period, in milliseconds
 * @param {number} n - the harmonic's order
 * @param {number} A - the harmonic's amplitude, unitless
 * @returns {number} y value (amplitude) at x
 * @private
 */

// Domain.SPACE, SeriesType.SINE
function getAmplitudeSpaceSine( x, t, L, T, n, A ) {
  return A * Math.sin( 2 * Math.PI * n * x / L );
}

// Domain.SPACE, SeriesType.COSINE
function getAmplitudeSpaceCosine( x, t, L, T, n, A ) {
  return A * Math.cos( 2 * Math.PI * n * x / L );
}

// Domain.TIME, SeriesType.SINE
function getAmplitudeTimeSine( x, t, L, T, n, A ) {
  return A * Math.sin( 2 * Math.PI * n * x / T );
}

// Domain.TIME, SeriesType.COSINE
function getAmplitudeTimeCosine( x, t, L, T, n, A ) {
  return A * Math.cos( 2 * Math.PI * n * x / T );
}

// Domain.SPACE_AND_TIME, SeriesType.SINE
function getAmplitudeSpaceAndTimeSine( x, t, L, T, n, A ) {
  return A * Math.sin( 2 * Math.PI * n * ( x / L - t / T ) );
}

// Domain.SPACE_AND_TIME, SeriesType.COSINE
function getAmplitudeSpaceAndTimeCosine( x, t, L, T, n, A ) {
  return A * Math.cos( 2 * Math.PI * n * ( x / L - t / T ) );
}

fourierMakingWaves.register( 'getAmplitudeFunction', getAmplitudeFunction );
export default getAmplitudeFunction;
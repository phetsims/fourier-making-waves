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
 * Gets the function that computes amplitude at an x value.
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @returns {function(x:number, t:number, L:number, T:number, order:number, amplitude:number):number}
 * @public
 */
export default function getAmplitudeFunction( domain, seriesType ) {

  assert && assert( Domain.enumeration.includes( domain ) );
  assert && assert( SeriesType.enumeration.includes( seriesType ) );

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

/**
 * These 6 functions all have the same signature, and use the equation that corresponds to EquationForm.MODE.
 * @param {number} A - the harmonic's amplitude, unitless
 * @param {number} n - the harmonic's order
 * @param {number} x - x-axis coordinate, whose semantics depend on the domain of the function
 * @param {number} t - the current time, in milliseconds
 * @param {number} L - the harmonic's wavelength, in meters
 * @param {number} T - the harmonic's period, in milliseconds
 * @returns {number} y value (amplitude) at x
 * @private
 */

// Domain.SPACE, SeriesType.SIN
function getAmplitudeSpaceSine( A, n, x, t, L, T ) {
  return A * Math.sin( 2 * Math.PI * n * x / L );
}

// Domain.SPACE, SeriesType.COS
function getAmplitudeSpaceCosine( A, n, x, t, L, T ) {
  return A * Math.cos( 2 * Math.PI * n * x / L );
}

// Domain.TIME, SeriesType.SIN
function getAmplitudeTimeSine( A, n, x, t, L, T ) {
  return A * Math.sin( 2 * Math.PI * n * x / T );
}

// Domain.TIME, SeriesType.COS
function getAmplitudeTimeCosine( A, n, x, t, L, T ) {
  return A * Math.cos( 2 * Math.PI * n * x / T );
}

// Domain.SPACE_AND_TIME, SeriesType.SIN
function getAmplitudeSpaceAndTimeSine( A, n, x, t, L, T ) {
  return A * Math.sin( 2 * Math.PI * n * ( x / L - t / T ) );
}

// Domain.SPACE_AND_TIME, SeriesType.COS
function getAmplitudeSpaceAndTimeCosine( A, n, x, t, L, T ) {
  return A * Math.cos( 2 * Math.PI * n * ( x / L - t / T ) );
}

fourierMakingWaves.register( 'getAmplitudeFunction', getAmplitudeFunction );
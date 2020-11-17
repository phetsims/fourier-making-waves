// Copyright 2020, University of Colorado Boulder

/**
 * Symbols used throughout this sim. These are also described in model.md.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../fourierMakingWaves.js';

const FMWSymbols = {
  CAPITAL_A: 'A', // amplitude
  CAPITAL_F: 'F', // function of frequency
  CAPITAL_L: 'L', // string length, if this were a plucked string
  CAPITAL_T: 'T', // sampling period, or period of the 1st harmonic
  PI: '\u03c0', // pi
  SMALL_K: 'k', // wave number
  SMALL_LAMBDA: '\u03bb', // wavelength
  SMALL_N: 'n', // mode, order, or harmonic number
  SMALL_OMEGA: '\u03c9', // angular frequency
  SMALL_SIGMA: '\u03c3', // width of the gaussian packet (dx)
  SMALL_T: 't', // time
  SMALL_X: 'x' // position in space along L
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
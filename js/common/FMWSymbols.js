// Copyright 2020, University of Colorado Boulder

/**
 * Symbols used throughout this sim, as described in model.md.
 *
 * This is also where MathSymbolFont is applied to symbols. By surrounding the symbol with
 * MathSymbolFont.getRichTextMarkup, all occurrences of a symbol will be rendered using MathSymbolFont.
 *
 * The naming convention used here is capital letters for symbols that are capital letters (e.g. SIGMA, T)
 * and lowercase letters for symbols that are lowercase letters (sigma, t).  This same naming convention is
 * used for string keys.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';

const FMWSymbols = {
  A: fourierMakingWavesStrings.symbol.A, // amplitude
  F: fourierMakingWavesStrings.symbol.F, // function of frequency
  L: fourierMakingWavesStrings.symbol.L, // string length, if this were a plucked string
  SIGMA: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' ), // summation symbol
  T: fourierMakingWavesStrings.symbol.T, // sampling period, or period of the 1st harmonic
  PI: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ), // pi
  f: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.f ), // frequency
  k: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.k ), // wave number
  lambda: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.lambda, 'normal' ), // wavelength
  n: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.n ), // mode, order, or harmonic number
  omega: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.omega, 'normal' ), // angular frequency
  sigma: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.sigma, 'normal' ), // width of the Gaussian wave packet (dx)
  t: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.t ), // time
  x: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.x ) // position in space along L
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
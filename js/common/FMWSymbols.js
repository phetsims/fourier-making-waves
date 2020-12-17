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
 * See https://github.com/phetsims/fourier-making-waves/issues/15 for the specification of which symbols
 * are translated, and how MathSymbolFont is applied.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';

const FMWSymbols = {
  A: fourierMakingWavesStrings.symbol.A, // amplitude
  cos: fourierMakingWavesStrings.symbol.cos, // cosine
  F: fourierMakingWavesStrings.symbol.F, // function of frequency
  f: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.f ), // frequency
  k: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.k ), // wave number
  L: fourierMakingWavesStrings.symbol.L, // string length, if this were a plucked string
  lambda: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.lambda, 'normal' ), // wavelength
  n: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.n ), // mode, order, or harmonic number
  omega: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.omega, 'normal' ), // angular frequency
  pi: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ), // pi
  SIGMA: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' ), // summation symbol
  sigma: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.sigma, 'normal' ), // width of the Gaussian wave packet (dx)
  sin: fourierMakingWavesStrings.symbol.sin, // sine
  T: fourierMakingWavesStrings.symbol.T, // sampling period, or period of the 1st harmonic
  t: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.t ), // time
  x: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.x ) // position in space along L
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
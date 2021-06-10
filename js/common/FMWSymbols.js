// Copyright 2020-2021, University of Colorado Boulder

/**
 * Symbols used throughout this sim, as described in model.md.
 *
 * This is also where MathSymbolFont is applied to symbols. By adding markup to a symbol with
 * MathSymbolFont.getRichTextMarkup, all occurrences of that symbol will be rendered using MathSymbolFont.
 *
 * The naming convention for fields in this object and associated string keys are:
 * - capital letters for symbols that are capital letters (e.g. SIGMA, T)
 * - lowercase letters for symbols that are lowercase letters (sigma, t).
 *
 * See https://github.com/phetsims/fourier-making-waves/issues/15 for the specification of which symbols
 * are translated, and which are rendered with MathSymbolFont.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';

const FMWSymbols = {
  A: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.A, 'normal' ), // amplitude
  cos: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.cos, 'normal' ), // cosine
  d: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.d ), // differential, like dx
  F: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.F, 'normal' ), // function of frequency
  f: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.f ), // frequency
  integral: MathSymbolFont.getRichTextMarkup( '\u222B', 'normal' ), // integration symbol
  k: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.k ), // wave number
  L: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.L, 'normal' ), // string length, if this were a plucked string
  lambda: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.lambda, 'normal' ), // wavelength
  n: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.n ), // mode, order, or harmonic number
  omega: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.omega, 'normal' ), // angular frequency
  pi: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ), // pi
  SIGMA: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' ), // summation symbol
  sigma: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.sigma, 'normal' ), // width of the Gaussian wave packet (dx)
  sin: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.sin, 'normal' ), // sine
  T: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.T, 'normal' ), // sampling period, or period of the 1st harmonic
  t: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.t ), // time
  x: MathSymbolFont.getRichTextMarkup( fourierMakingWavesStrings.symbol.x ) // position in space along L
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
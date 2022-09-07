// Copyright 2020-2021, University of Colorado Boulder

/**
 * Symbols used throughout this sim, as described in model.md.
 *
 * This is also where MathSymbolFont is applied to symbols. By adding RichText markup to a symbol with
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
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';

const FMWSymbols = {
  A: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.A, 'normal' ), // amplitude
  cos: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.cos, 'normal' ), // cosine
  d: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.d ), // differential, like dx
  F: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.F, 'normal' ), // function of frequency
  f: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.f ), // frequency
  infinity: MathSymbolFont.getRichTextMarkup( '\u221e', 'normal' ),
  integral: MathSymbolFont.getRichTextMarkup( '\u222B', 'normal' ), // integration symbol
  k: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.k ), // wave number
  L: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.L, 'normal' ), // string length, if this were a plucked string
  lambda: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.lambda, 'normal' ), // wavelength
  n: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.n ), // mode, order, or harmonic number
  omega: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.omega, 'normal' ), // angular frequency
  pi: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ), // pi
  SIGMA: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' ), // summation symbol
  sigma: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.sigma, 'normal' ), // width of the Gaussian wave packet (dx)
  sin: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.sin, 'normal' ), // sine
  T: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.T, 'normal' ), // sampling period, or period of the 1st harmonic
  t: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.t ), // time
  x: MathSymbolFont.getRichTextMarkup( FourierMakingWavesStrings.symbol.x ) // position in space along L
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
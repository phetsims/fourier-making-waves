// Copyright 2020, University of Colorado Boulder

/**
 * Symbols used throughout this sim, as described in model.md.
 *
 * This is also where MathSymbolFont is applied to symbols. By surrounding the symbol with
 * MathSymbolFont.getRichTextMarkup, all occurrences of a symbol will be rendered using MathSymbolFont.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FMWSymbols = {
  CAPITAL_A: 'A', // amplitude
  CAPITAL_F: 'F', // function of frequency
  CAPITAL_L: 'L', // string length, if this were a plucked string
  CAPITAL_T: 'T', // sampling period, or period of the 1st harmonic
  CAPITAL_SIGMA: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' ), // summation symbol
  PI: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ), // pi
  SMALL_K: MathSymbolFont.getRichTextMarkup( 'k' ), // wave number
  SMALL_LAMBDA: MathSymbolFont.getRichTextMarkup( '\u03bb', 'normal' ), // wavelength
  SMALL_N: MathSymbolFont.getRichTextMarkup( 'n' ), // mode, order, or harmonic number
  SMALL_OMEGA: MathSymbolFont.getRichTextMarkup( '\u03c9', 'normal' ), // angular frequency
  SMALL_SIGMA: MathSymbolFont.getRichTextMarkup( '\u03c3', 'normal' ), // width of the gaussian packet (dx)
  SMALL_T: MathSymbolFont.getRichTextMarkup( 't' ), // time
  SMALL_X: MathSymbolFont.getRichTextMarkup( 'x' ) // position in space along L
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
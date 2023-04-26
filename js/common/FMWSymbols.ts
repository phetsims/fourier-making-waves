// Copyright 2020-2023, University of Colorado Boulder

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

  //-----------------------------------------------------------------------------------------------------------
  // Symbols that are translated

  // amplitude
  AStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.AStringProperty, 'normal' ),

  // cosine
  cosStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.cosStringProperty, 'normal' ),

  // differential, like dx
  dStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.dStringProperty ),

  // function of frequency
  FStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.FStringProperty, 'normal' ),

  // frequency
  fStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.fStringProperty ),

  // wave number
  kStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.kStringProperty ),

  // string length, if this were a plucked string
  LStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.LStringProperty, 'normal' ),

  // wavelength
  lambdaStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.lambdaStringProperty, 'normal' ),

  // mode, order, or harmonic number
  nStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.nStringProperty ),

  // angular frequency
  omegaStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.omegaStringProperty, 'normal' ),

  // width of the Gaussian wave packet (dx)
  sigmaStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.sigmaStringProperty, 'normal' ),

  // sine
  sinStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.sinStringProperty, 'normal' ),

  // sampling period, or period of the 1st harmonic
  TStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.TStringProperty, 'normal' ),

  // time
  tStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.tStringProperty ),

  // position in space along L
  xStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.xStringProperty ),

  //-----------------------------------------------------------------------------------------------------------
  // Symbols that are not translated

  infinity: MathSymbolFont.getRichTextMarkup( '\u221e', 'normal' ),

  // integration symbol
  integral: MathSymbolFont.getRichTextMarkup( '\u222B', 'normal' ),

  // pi
  pi: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ),

  // summation symbol
  SIGMA: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' )
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
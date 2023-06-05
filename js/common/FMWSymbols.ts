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
  ASymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.AStringProperty, {
    style: 'normal'
  } ),

  // cosine
  cosSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.cosStringProperty, {
    style: 'normal'
  } ),

  // differential, like dx
  dSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.dStringProperty ),

  // function of frequency
  FSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.FStringProperty, {
    style: 'normal'
  } ),

  // frequency
  fSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.fStringProperty ),

  // wave number
  kSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.kStringProperty ),

  // string length, if this were a plucked string
  LSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.LStringProperty, {
    style: 'normal'
  } ),

  // wavelength
  lambdaSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.lambdaStringProperty, {
    style: 'normal'
  } ),

  // mode, order, or harmonic number
  nSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.nStringProperty ),

  // angular frequency
  omegaSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.omegaStringProperty, {
    style: 'normal'
  } ),

  // width of the Gaussian wave packet (dx)
  sigmaSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.sigmaStringProperty, {
    style: 'normal'
  } ),

  // sine
  sinSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.sinStringProperty, {
    style: 'normal'
  } ),

  // sampling period, or period of the 1st harmonic
  TSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.TStringProperty, {
    style: 'normal'
  } ),

  // time
  tSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.tStringProperty ),

  // position in space along L
  xSymbolProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.xStringProperty ),

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
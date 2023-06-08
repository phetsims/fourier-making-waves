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
import Tandem from '../../../tandem/js/Tandem.js';

const DERIVED_STRINGS_TANDEM = Tandem.getDerivedStringsTandem();

const FMWSymbols = {

  //-----------------------------------------------------------------------------------------------------------
  // Symbols that are translated

  // amplitude
  AMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.AStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'AMarkupStringProperty' )
  } ),

  // cosine
  cosMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.cosStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'cosMarkupStringProperty' )
  } ),

  // differential, like dx
  dMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.dStringProperty, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'dMarkupStringProperty' )
  } ),

  // function of frequency
  FMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.FStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'FMarkupStringProperty' )
  } ),

  // frequency
  fMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.fStringProperty, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'fMarkupStringProperty' )
  } ),

  // wave number
  kMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.kStringProperty, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'kMarkupStringProperty' )
  } ),

  // string length, if this were a plucked string
  LMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.LStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'LMarkupStringProperty' )
  } ),

  // wavelength
  lambdaMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.lambdaStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'lambdaMarkupStringProperty' )
  } ),

  // mode, order, or harmonic number
  nMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.nStringProperty, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'nMarkupStringProperty' )
  } ),

  // angular frequency
  omegaMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.omegaStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'omegaMarkupStringProperty' )
  } ),

  // width of the Gaussian wave packet (dx)
  sigmaMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.sigmaStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'sigmaMarkupStringProperty' )
  } ),

  // sine
  sinMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.sinStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'sinMarkupStringProperty' )
  } ),

  // sampling period, or period of the 1st harmonic
  TMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.TStringProperty, {
    style: 'normal',
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'TMarkupStringProperty' )
  } ),

  // time
  tMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.tStringProperty, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'tMarkupStringProperty' )
  } ),

  // position in space along L
  xMarkupStringProperty: MathSymbolFont.createDerivedProperty( FourierMakingWavesStrings.symbol.xStringProperty, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'xMarkupStringProperty' )
  } ),

  //-----------------------------------------------------------------------------------------------------------
  // Symbols that are not translated

  infinityMarkup: MathSymbolFont.getRichTextMarkup( '\u221e', 'normal' ),

  // integration symbol
  integralMarkup: MathSymbolFont.getRichTextMarkup( '\u222B', 'normal' ),

  // pi
  piMarkup: MathSymbolFont.getRichTextMarkup( '\u03c0', 'normal' ),

  // summation symbol
  sigmaMarkup: MathSymbolFont.getRichTextMarkup( '\u03a3', 'normal' )
};

fourierMakingWaves.register( 'FMWSymbols', FMWSymbols );
export default FMWSymbols;
// Copyright 2023, University of Colorado Boulder

/**
 * Derived strings used globally throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../axon/js/PatternStringProperty.js';
import StringProperty from '../../../axon/js/StringProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';
import FMWSymbols from './FMWSymbols.js';

const DERIVED_STRINGS_TANDEM = Tandem.getDerivedStringsTandem();

const FMWDerivedStrings = {

  k1StringProperty: new PatternStringProperty( new StringProperty( '{{k}}<sub>1</sub>' ), {
    k: FMWSymbols.kMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  omega1StringProperty: new PatternStringProperty( new StringProperty( '{{omega}}<sub>1</sub>' ), {
    omega: FMWSymbols.omegaMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  xMetersStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolUnitsStringProperty, {
    symbol: FMWSymbols.xMarkupStringProperty,
    units: FourierMakingWavesStrings.units.metersStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  xMillisecondsStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolUnitsStringProperty, {
    symbol: FMWSymbols.tMarkupStringProperty,
    units: FourierMakingWavesStrings.units.millisecondsStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  functionOfSpaceStringProperty: new PatternStringProperty( FourierMakingWavesStrings.spaceSymbolStringProperty, {
    symbol: FMWSymbols.xMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  functionOfTimeStringProperty: new PatternStringProperty( FourierMakingWavesStrings.timeSymbolStringProperty, {
    symbol: FMWSymbols.tMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  functionOfSpaceAndTimeStringProperty: new PatternStringProperty( FourierMakingWavesStrings.spaceAndTimeSymbolsStringProperty, {
    spaceSymbol: FMWSymbols.xMarkupStringProperty,
    timeSymbol: FMWSymbols.tMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  lambdaAndTStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolAndSymbolStringProperty, {
    symbol1: FMWSymbols.lambdaMarkupStringProperty,
    symbol2: FMWSymbols.TMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  kAndOmegaStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolAndSymbolStringProperty, {
    symbol1: FMWSymbols.kMarkupStringProperty,
    symbol2: FMWSymbols.omegaMarkupStringProperty
  }, {
    tandem: Tandem.OPT_OUT
  } ),

  ADescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.AStringProperty, {
    A: FMWSymbols.AMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'ADescriptionStringProperty' )
  } ),

  fDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.fStringProperty, {
    f: FMWSymbols.fMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'fDescriptionStringProperty' )
  } ),

  lambdaDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.lambdaStringProperty, {
    lambda: FMWSymbols.lambdaMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'lambdaDescriptionStringProperty' )
  } ),

  kDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.kStringProperty, {
    k: FMWSymbols.kMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'kDescriptionStringProperty' )
  } ),

  LDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.LStringProperty, {
    L: FMWSymbols.LMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'LDescriptionStringProperty' )
  } ),

  nDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.nStringProperty, {
    n: FMWSymbols.nMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'nDescriptionStringProperty' )
  } ),

  tDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.tStringProperty, {
    t: FMWSymbols.tMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'tDescriptionStringProperty' )
  } ),

  TDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.TStringProperty, {
    T: FMWSymbols.TMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'TDescriptionStringProperty' )
  } ),

  omegaDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.omegaStringProperty, {
    omega: FMWSymbols.omegaMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'omegaDescriptionStringProperty' )
  } ),

  sigmaDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.sigmaStringProperty, {
    sigma: FMWSymbols.sigmaMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'sigmaDescriptionStringProperty' )
  } ),

  xDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.xStringProperty, {
    x: FMWSymbols.xMarkupStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'xDescriptionStringProperty' )
  } )
};

fourierMakingWaves.register( 'FMWDerivedStrings', FMWDerivedStrings );
export default FMWDerivedStrings;
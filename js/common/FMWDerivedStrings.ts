// Copyright 2023, University of Colorado Boulder

/**
 * Derived strings used globally throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../fourierMakingWaves.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWSymbols from './FMWSymbols.js';
import PatternStringProperty from '../../../axon/js/PatternStringProperty.js';
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';
import StringProperty from '../../../axon/js/StringProperty.js';

//TODO https://github.com/phetsims/tandem/issues/298
const DERIVED_STRINGS_TANDEM = Tandem.GENERAL_MODEL.createTandem( 'strings' ).createTandem( 'fourierMakingWaves' ).createTandem( 'derivedStrings' )

const FMWDerivedStrings = {

  k1StringProperty: new PatternStringProperty( new StringProperty( '{{k}}<sub>1</sub>' ), {
    k: FMWSymbols.kSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'k1StringProperty' )
  } ),

  omega1StringProperty: new PatternStringProperty( new StringProperty( '{{omega}}<sub>1</sub>' ), {
    omega: FMWSymbols.omegaSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'omega1StringProperty' )
  } ),

  xMetersStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolUnitsStringProperty, {
    symbol: FMWSymbols.xSymbolProperty,
    units: FourierMakingWavesStrings.units.metersStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'xMetersStringProperty' )
  } ),

  xMillisecondsStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolUnitsStringProperty, {
    symbol: FMWSymbols.tSymbolProperty,
    units: FourierMakingWavesStrings.units.millisecondsStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'xMillisecondsStringProperty' )
  } ),

  spaceXStringProperty: new PatternStringProperty( FourierMakingWavesStrings.spaceSymbolStringProperty, {
    symbol: FMWSymbols.xSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'spaceXStringProperty' )
  } ),

  timeTStringProperty: new PatternStringProperty( FourierMakingWavesStrings.timeSymbolStringProperty, {
    symbol: FMWSymbols.tSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'timeTStringProperty' )
  } ),

  spaceAndTimeXTStringProperty: new PatternStringProperty( FourierMakingWavesStrings.spaceAndTimeSymbolsStringProperty, {
    spaceSymbol: FMWSymbols.xSymbolProperty,
    timeSymbol: FMWSymbols.tSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'spaceAndTimeXTStringProperty' )
  } ),

  lambdaAndTStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolAndSymbolStringProperty, {
    symbol1: FMWSymbols.lambdaSymbolProperty,
    symbol2: FMWSymbols.TSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'lambdaAndTStringProperty' )
  } ),

  kAndOmegaStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolAndSymbolStringProperty, {
    symbol1: FMWSymbols.kSymbolProperty,
    symbol2: FMWSymbols.omegaSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'kAndOmegaStringProperty' )
  } ),

  ADescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.AStringProperty, {
    A: FMWSymbols.ASymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'ADescriptionStringProperty' )
  } ),

  fDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.fStringProperty, {
    f: FMWSymbols.fSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'fDescriptionStringProperty' )
  } ),

  lambdaDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.lambdaStringProperty, {
    lambda: FMWSymbols.lambdaSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'lambdaDescriptionStringProperty' )
  } ),

  kDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.kStringProperty, {
    k: FMWSymbols.kSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'kDescriptionStringProperty' )
  } ),

  LDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.LStringProperty, {
    L: FMWSymbols.LSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'LDescriptionStringProperty' )
  } ),

  nDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.nStringProperty, {
    n: FMWSymbols.nSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'nDescriptionStringProperty' )
  } ),

  tDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.tStringProperty, {
    t: FMWSymbols.tSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'tDescriptionStringProperty' )
  } ),

  TDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.TStringProperty, {
    T: FMWSymbols.TSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'TDescriptionStringProperty' )
  } ),

  omegaDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.omegaStringProperty, {
    omega: FMWSymbols.omegaSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'omegaDescriptionStringProperty' )
  } ),

  sigmaDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.sigmaStringProperty, {
    sigma: FMWSymbols.sigmaSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'sigmaDescriptionStringProperty' )
  } ),

  xDescriptionStringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.xStringProperty, {
    x: FMWSymbols.xSymbolProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( 'xDescriptionStringProperty' )
  } )
};

fourierMakingWaves.register( 'FMWDerivedStrings', FMWDerivedStrings );
export default FMWDerivedStrings;
// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import fourierMakingWaves from './fourierMakingWaves.js';

type StringsType = {
  'fourier-making-waves': {
    'title': string;
    'titleProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'discrete': string;
    'discreteProperty': TReadOnlyProperty<string>;
    'waveGame': string;
    'waveGameProperty': TReadOnlyProperty<string>;
    'wavePacket': string;
    'wavePacketProperty': TReadOnlyProperty<string>;
  };
  'fourierSeries': string;
  'fourierSeriesProperty': TReadOnlyProperty<string>;
  'graphControls': string;
  'graphControlsProperty': TReadOnlyProperty<string>;
  'measurementTools': string;
  'measurementToolsProperty': TReadOnlyProperty<string>;
  'sinusoid': string;
  'sinusoidProperty': TReadOnlyProperty<string>;
  'triangle': string;
  'triangleProperty': TReadOnlyProperty<string>;
  'square': string;
  'squareProperty': TReadOnlyProperty<string>;
  'sawtooth': string;
  'sawtoothProperty': TReadOnlyProperty<string>;
  'wavePacket': string;
  'wavePacketProperty': TReadOnlyProperty<string>;
  'custom': string;
  'customProperty': TReadOnlyProperty<string>;
  'waveform': string;
  'waveformProperty': TReadOnlyProperty<string>;
  'harmonics': string;
  'harmonicsProperty': TReadOnlyProperty<string>;
  'harmonicsChart': string;
  'harmonicsChartProperty': TReadOnlyProperty<string>;
  'functionOf': string;
  'functionOfProperty': TReadOnlyProperty<string>;
  'series': string;
  'seriesProperty': TReadOnlyProperty<string>;
  'spaceSymbol': string;
  'spaceSymbolProperty': TReadOnlyProperty<string>;
  'timeSymbol': string;
  'timeSymbolProperty': TReadOnlyProperty<string>;
  'spaceAndTimeSymbols': string;
  'spaceAndTimeSymbolsProperty': TReadOnlyProperty<string>;
  'wavelength': string;
  'wavelengthProperty': TReadOnlyProperty<string>;
  'period': string;
  'periodProperty': TReadOnlyProperty<string>;
  'equation': string;
  'equationProperty': TReadOnlyProperty<string>;
  'hidden': string;
  'hiddenProperty': TReadOnlyProperty<string>;
  'symbolAndSymbol': string;
  'symbolAndSymbolProperty': TReadOnlyProperty<string>;
  'amplitude': string;
  'amplitudeProperty': TReadOnlyProperty<string>;
  'sum': string;
  'sumProperty': TReadOnlyProperty<string>;
  'infiniteHarmonics': string;
  'infiniteHarmonicsProperty': TReadOnlyProperty<string>;
  'minToMax': string;
  'minToMaxProperty': TReadOnlyProperty<string>;
  'enter': string;
  'enterProperty': TReadOnlyProperty<string>;
  'sawtoothWithCosines': string;
  'sawtoothWithCosinesProperty': TReadOnlyProperty<string>;
  'expandedForm': string;
  'expandedFormProperty': TReadOnlyProperty<string>;
  'symbol': {
    'A': string;
    'AProperty': TReadOnlyProperty<string>;
    'cos': string;
    'cosProperty': TReadOnlyProperty<string>;
    'd': string;
    'dProperty': TReadOnlyProperty<string>;
    'F': string;
    'FProperty': TReadOnlyProperty<string>;
    'L': string;
    'LProperty': TReadOnlyProperty<string>;
    'T': string;
    'TProperty': TReadOnlyProperty<string>;
    'f': string;
    'fProperty': TReadOnlyProperty<string>;
    'k': string;
    'kProperty': TReadOnlyProperty<string>;
    'lambda': string;
    'lambdaProperty': TReadOnlyProperty<string>;
    'n': string;
    'nProperty': TReadOnlyProperty<string>;
    'omega': string;
    'omegaProperty': TReadOnlyProperty<string>;
    'sigma': string;
    'sigmaProperty': TReadOnlyProperty<string>;
    'sin': string;
    'sinProperty': TReadOnlyProperty<string>;
    't': string;
    'tProperty': TReadOnlyProperty<string>;
    'x': string;
    'xProperty': TReadOnlyProperty<string>;
  };
  'symbolsDialog': {
    'title': string;
    'titleProperty': TReadOnlyProperty<string>;
    'A': string;
    'AProperty': TReadOnlyProperty<string>;
    'f': string;
    'fProperty': TReadOnlyProperty<string>;
    'lambda': string;
    'lambdaProperty': TReadOnlyProperty<string>;
    'k': string;
    'kProperty': TReadOnlyProperty<string>;
    'L': string;
    'LProperty': TReadOnlyProperty<string>;
    'n': string;
    'nProperty': TReadOnlyProperty<string>;
    't': string;
    'tProperty': TReadOnlyProperty<string>;
    'T': string;
    'TProperty': TReadOnlyProperty<string>;
    'x': string;
    'xProperty': TReadOnlyProperty<string>;
    'sigma': string;
    'sigmaProperty': TReadOnlyProperty<string>;
    'omega': string;
    'omegaProperty': TReadOnlyProperty<string>;
  };
  'levels': string;
  'levelsProperty': TReadOnlyProperty<string>;
  'chooseYourLevel': string;
  'chooseYourLevelProperty': TReadOnlyProperty<string>;
  'matchUsing1Harmonic': string;
  'matchUsing1HarmonicProperty': TReadOnlyProperty<string>;
  'matchUsingNHarmonics': string;
  'matchUsingNHarmonicsProperty': TReadOnlyProperty<string>;
  'matchUsingNOrMoreHarmonics': string;
  'matchUsingNOrMoreHarmonicsProperty': TReadOnlyProperty<string>;
  'info1Harmonic': string;
  'info1HarmonicProperty': TReadOnlyProperty<string>;
  'infoNHarmonics': string;
  'infoNHarmonicsProperty': TReadOnlyProperty<string>;
  'infoNOrMoreHarmonics': string;
  'infoNOrMoreHarmonicsProperty': TReadOnlyProperty<string>;
  'checkAnswer': string;
  'checkAnswerProperty': TReadOnlyProperty<string>;
  'showAnswer': string;
  'showAnswerProperty': TReadOnlyProperty<string>;
  'newWaveform': string;
  'newWaveformProperty': TReadOnlyProperty<string>;
  'amplitudeControls': string;
  'amplitudeControlsProperty': TReadOnlyProperty<string>;
  'componentSpacing': string;
  'componentSpacingProperty': TReadOnlyProperty<string>;
  'wavePacketCenter': string;
  'wavePacketCenterProperty': TReadOnlyProperty<string>;
  'wavePacketWidth': string;
  'wavePacketWidthProperty': TReadOnlyProperty<string>;
  'amplitudesOfFourierComponents': string;
  'amplitudesOfFourierComponentsProperty': TReadOnlyProperty<string>;
  'fourierComponents': string;
  'fourierComponentsProperty': TReadOnlyProperty<string>;
  'waveformEnvelope': string;
  'waveformEnvelopeProperty': TReadOnlyProperty<string>;
  'widthIndicators': string;
  'widthIndicatorsProperty': TReadOnlyProperty<string>;
  'continuousWaveform': string;
  'continuousWaveformProperty': TReadOnlyProperty<string>;
  'symbolValueUnits': string;
  'symbolValueUnitsProperty': TReadOnlyProperty<string>;
  'symbolSymbolValueUnits': string;
  'symbolSymbolValueUnitsProperty': TReadOnlyProperty<string>;
  'units': {
    'meters': string;
    'metersProperty': TReadOnlyProperty<string>;
    'milliseconds': string;
    'millisecondsProperty': TReadOnlyProperty<string>;
    'radiansPerMeter': string;
    'radiansPerMeterProperty': TReadOnlyProperty<string>;
    'radiansPerMillisecond': string;
    'radiansPerMillisecondProperty': TReadOnlyProperty<string>;
  };
  'symbolUnits': string;
  'symbolUnitsProperty': TReadOnlyProperty<string>;
  'infiniteComponentsCannotBePlotted': string;
  'infiniteComponentsCannotBePlottedProperty': TReadOnlyProperty<string>;
  'keyboardHelpDialog': {
    'gameControls': string;
    'gameControlsProperty': TReadOnlyProperty<string>;
    'checkYourAnswer': string;
    'checkYourAnswerProperty': TReadOnlyProperty<string>;
    'measurementTools': string;
    'measurementToolsProperty': TReadOnlyProperty<string>;
    'moveTool': string;
    'moveToolProperty': TReadOnlyProperty<string>;
    'moveToolSlower': string;
    'moveToolSlowerProperty': TReadOnlyProperty<string>;
  }
};

const fourierMakingWavesStrings = getStringModule( 'FOURIER_MAKING_WAVES' ) as StringsType;

fourierMakingWaves.register( 'fourierMakingWavesStrings', fourierMakingWavesStrings );

export default fourierMakingWavesStrings;

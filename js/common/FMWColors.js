// Copyright 2020-2021, University of Colorado Boulder

//TODO Should any of these be moved to where they are used? or don't need to be ProfileColorProperty?
//TODO tandem for each ProfileColorProperty instance
/**
 * FMWColors defines the colors for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FMWColors = {

  // Background colors for screens.
  discreteScreenBackgroundColorProperty: new ProfileColorProperty( 'discreteScreenBackgroundColorProperty', {
    default: new Color( 236, 255, 255 )
  } ),
  waveGameScreenBackgroundColorProperty: new ProfileColorProperty( 'waveGameScreenBackgroundColorProperty', {
    default: new Color( 236, 255, 255 )
  } ),
  wavePacketScreenBackgroundColorProperty: new ProfileColorProperty( 'wavePacketScreenBackgroundColor', {
    default: new Color( 255, 250, 227 )
  } ),

  // Fill for all Panels
  panelFillProperty: new ProfileColorProperty( 'panelFill', {
    default: Color.grayColor( 245 )
  } ),

  // Stroke for all Panels
  panelStrokeProperty: new ProfileColorProperty( 'panelStroke', {
    default: Color.grayColor( 160 )
  } ),

  // Stroke for horizontal separators in Panels
  separatorStrokeProperty: new ProfileColorProperty( 'separatorStroke', {
    default: Color.grayColor( 200 )
  } ),

  // Grid line stroke for all charts except the Amplitude chart in the 'Discrete' and 'Wave Game' screens
  chartGridLinesStrokeProperty: new ProfileColorProperty( 'chartGridLinesStroke', {
    default: Color.grayColor( 200 )
  } ),

  // Stroke for all x and y axes
  axisStrokeProperty: new ProfileColorProperty( 'axisStroke', {
    default: Color.grayColor( 170 )
  } ),

  // Stroke for the sum plot in the Discrete and Wave Packet screens
  sumPlotStrokeProperty: new ProfileColorProperty( 'sumStroke', {
    default: 'black'
  } ),

  // Stroke used to plot answer to a challenge in Sum chart of the Wave Game screen.
  // If you're thinking of changing this to something other than pink, note that the UI says "Match the pink waveform..."
  answerSumPlotStrokeProperty: new ProfileColorProperty( 'answerSumPlotStroke', {
    default: new Color( 255, 0, 255 )
  } ),

  // Stoke used to plot the user's guess to a challenge in the Sum chart of the Wave Game screen.
  guessSumPlotStrokeProperty: new ProfileColorProperty( 'guessSumPlotStroke', {
    default: 'black'
  } ),

  // Stroke used to plot the Sum for infinite harmonics in the Discrete screen
  infiniteHarmonicsStrokeProperty: new ProfileColorProperty( 'infiniteHarmonicsStroke', {
    default: Color.grayColor( 189 )
  } ),

  // Fill for the level-selection buttons AND the scoreboard in the Wave Game screen
  levelSelectionButtonFillProperty: new ProfileColorProperty( 'levelSelectionButtonFill', {
    default: new Color( 255, 214, 228 )
  } ),

  // Fill for the width indicators in the Wave Packet screen
  widthIndicatorsColorProperty: new ProfileColorProperty( 'widthIndicatorsColor', {
    default: 'red'
  } ),

  // Stroke for the Continuous Waveform in the Wave Packet screen
  continuousWaveformStrokeProperty: new ProfileColorProperty( 'continuousWaveformStroke', {
    default: Color.grayColor( 189 )
  } ),

  // Stroke for the Waveform Envelope in the Wave Packet screen
  waveformEnvelopeStrokeProperty: new ProfileColorProperty( 'waveformEnvelopeStroke', {
    default: Color.grayColor( 189 )
  } ),

  // The range of gray colors that are assigned to Fourier components in Wave Packet screen
  FOURIER_COMPONENT_GRAY_RANGE: new Range( 0, 230 )
};

// Create a ProfileColorProperty for each harmonic. Colors are listed by increasing harmonic order.
// Given a harmonic order, the harmonic's ProfileColorProperty is FMWColors.HARMONIC_COLOR_PROPERTIES[order - 1].
const HARMONIC_COLORS = [
  new Color( 255, 0, 0 ),
  new Color( 255, 128, 0 ),
  new Color( 255, 255, 0 ),
  new Color( 0, 255, 0 ),
  new Color( 0, 201, 87 ),
  new Color( 100, 149, 237 ),
  new Color( 0, 0, 255 ),
  new Color( 0, 0, 128 ),
  new Color( 145, 33, 158 ),
  new Color( 186, 85, 211 ),
  new Color( 255, 105, 180 )
];
FMWColors.HARMONIC_COLOR_PROPERTIES = _.map( HARMONIC_COLORS,
  ( color, index ) => new ProfileColorProperty( `harmonic${index + 1}Color`, {
    default: HARMONIC_COLORS[ index ]
  } ) );

fourierMakingWaves.register( 'FMWColors', FMWColors );
export default FMWColors;
// Copyright 2020-2023, University of Colorado Boulder

/**
 * FMWColors defines the colors for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const HARMONIC_COLORS = [
  new Color( 255, 0, 0 ),
  new Color( 255, 128, 0 ),
  new Color( 255, 210, 0 ),
  new Color( 0, 255, 0 ),
  new Color( 0, 201, 87 ),
  new Color( 100, 149, 237 ),
  new Color( 0, 0, 255 ),
  new Color( 0, 0, 128 ),
  new Color( 145, 33, 158 ),
  new Color( 186, 85, 211 ),
  new Color( 255, 105, 180 )
];

const FMWColors = {

  // Background colors for screens.
  discreteScreenBackgroundColorProperty: new ProfileColorProperty( fourierMakingWaves, 'discreteScreenBackgroundColor', {
    default: new Color( 236, 255, 255 )
  } ),
  waveGameScreenBackgroundColorProperty: new ProfileColorProperty( fourierMakingWaves, 'waveGameScreenBackgroundColor', {
    default: new Color( 236, 255, 255 )
  } ),
  wavePacketScreenBackgroundColorProperty: new ProfileColorProperty( fourierMakingWaves, 'wavePacketScreenBackgroundColor', {
    default: new Color( 255, 250, 227 )
  } ),

  // Fill for all Panels
  panelFillProperty: new ProfileColorProperty( fourierMakingWaves, 'panelFill', {
    default: Color.grayColor( 245 )
  } ),

  // Stroke for all Panels
  panelStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'panelStroke', {
    default: Color.grayColor( 160 )
  } ),

  // Stroke for horizontal separators in Panels
  separatorStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'separatorStroke', {
    default: Color.grayColor( 200 )
  } ),

  // Grid line stroke for the Amplitudes chart in the 'Discrete' and 'Wave Game' screens
  amplitudesGridLinesStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'amplitudesGridLinesStroke', {
    default: 'black'
  } ),

  // Grid line stroke for all charts except the Amplitudes chart in the 'Discrete' and 'Wave Game' screens
  chartGridLinesStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'chartGridLinesStroke', {
    default: Color.grayColor( 200 )
  } ),

  // Stroke for all x and y axes
  axisStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'axisStroke', {
    default: Color.grayColor( 170 )
  } ),

  // Stroke for the sum plot in all screens
  sumPlotStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'sumStroke', {
    default: 'black'
  } ),

  // Stroke used to plot answer to a challenge in Sum chart of the Wave Game screen.
  // If you're thinking of changing this to something other than pink, note that the UI says "Match the pink waveform..."
  answerSumPlotStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'answerSumPlotStroke', {
    default: new Color( 255, 0, 255 )
  } ),

  // Stroke used to plot the user's guess to a challenge in the Sum chart of the Wave Game screen.
  guessSumPlotStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'guessSumPlotStroke', {
    default: 'black'
  } ),

  // Stroke used to plot secondary waveforms: Infinite Harmonics, Continuous Waveform, Waveform Envelope
  secondaryWaveformStrokeProperty: new ProfileColorProperty( fourierMakingWaves, 'secondaryWaveformStroke', {
    default: Color.grayColor( 189 )
  } ),

  // Fill for the level-selection buttons AND the scoreboard in the Wave Game screen
  levelSelectionButtonFillProperty: new ProfileColorProperty( fourierMakingWaves, 'levelSelectionButtonFill', {
    default: new Color( 255, 214, 228 )
  } ),

  // Fill for the width indicators in the Wave Packet screen
  widthIndicatorsColorProperty: new ProfileColorProperty( fourierMakingWaves, 'widthIndicatorsColor', {
    default: 'red'
  } ),

  // Fill for the Component Spacing measurement tool in the Wave Packet screen
  componentSpacingToolFillProperty: new ProfileColorProperty( fourierMakingWaves, 'componentSpacingToolFill', {
    default: 'yellow'
  } ),

  // Fill for the length (waveform or period) measurement tool in the Wave Packet screen
  wavePacketLengthToolFillProperty: new ProfileColorProperty( fourierMakingWaves, 'wavePacketLengthToolFill', {
    default: 'rgb( 0, 255, 0 )'
  } ),

  // The range of gray colors that are assigned to Fourier components in Wave Packet screen
  FOURIER_COMPONENT_GRAY_RANGE: new Range( 0, 230 ),

  // A ProfileColorProperty for each harmonic. Colors are listed by increasing harmonic order.
  // Given a harmonic order, the harmonic's ProfileColorProperty is FMWColors.HARMONIC_COLOR_PROPERTIES[order - 1].
  HARMONIC_COLOR_PROPERTIES: HARMONIC_COLORS.map(
    ( color, index ) => new ProfileColorProperty( fourierMakingWaves, `harmonic${index + 1}Color`, {
      default: HARMONIC_COLORS[ index ]
    } ) )
};

fourierMakingWaves.register( 'FMWColors', FMWColors );
export default FMWColors;
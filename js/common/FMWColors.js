// Copyright 2020-2021, University of Colorado Boulder

//TODO Should any of these be moved to where they are used?
//TODO tandem for each ProfileColorProperty instance
/**
 * FMWColors defines the colors for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
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

  amplitudeGridLinesStrokeProperty: new ProfileColorProperty( 'amplitudeGridLinesStroke', {
    default: Color.BLACK
  } ),

  chartGridLinesStrokeProperty: new ProfileColorProperty( 'chartGridLinesStroke', {
    default: Color.grayColor( 200 )
  } ),

  axisStrokeProperty: new ProfileColorProperty( 'axisStroke', {
    default: Color.grayColor( 170 )
  } ),

  levelSelectionButtonFillProperty: new ProfileColorProperty( 'levelSelectionButtonFill', {
    default: new Color( 255, 214, 228 )
  } ),

  scoreBoardFillProperty: new ProfileColorProperty( 'scoreBoardFill', {
    default: new Color( 255, 214, 228 )
  } ),

  newWaveformButtonFillProperty: new ProfileColorProperty( 'newWaveformButtonFill', {
    default: PhetColorScheme.BUTTON_YELLOW
  } ),

  checkAnswerButtonFillProperty: new ProfileColorProperty( 'checkAnswerButtonFill', {
    default: PhetColorScheme.BUTTON_YELLOW
  } ),

  showAnswerButtonFillProperty: new ProfileColorProperty( 'showAnswerButtonFill', {
    default: PhetColorScheme.BUTTON_YELLOW
  } ),

  sumStrokeProperty: new ProfileColorProperty( 'sumStroke', {
    default: new Color( 0, 0, 0 )
  } ),

  answerSumStrokeProperty: new ProfileColorProperty( 'answerSumStroke', {
    default: new Color( 255, 0, 255 )
  } ),

  guessSumStrokeProperty: new ProfileColorProperty( 'guessSumStroke', {
    default: new Color( 0, 0, 0 )
  } ),

  infiniteHarmonicsStrokeProperty: new ProfileColorProperty( 'infiniteHarmonicsStroke', {
    default: Color.grayColor( 189 )
  } ),

  widthIndicatorsColorProperty: new ProfileColorProperty( 'widthIndicatorsColor', {
    default: new Color( 255, 0, 0 )
  } )
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
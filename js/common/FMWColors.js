// Copyright 2020-2021, University of Colorado Boulder

/**
 * FMWColors defines the colors for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../phetcommon/js/AssertUtils.js';
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

  // Colors for each harmonics. Name format is `harmonic${order}Color` to facilitate lookup by order.
  harmonic1ColorProperty: new ProfileColorProperty( 'harmonic1Color', {
    default: new Color( 255, 0, 0 )
  } ),

  harmonic2ColorProperty: new ProfileColorProperty( 'harmonic2Color', {
    default: new Color( 255, 128, 0 )
  } ),

  harmonic3ColorProperty: new ProfileColorProperty( 'harmonic3Color', {
    default: new Color( 255, 255, 0 )
  } ),

  harmonic4ColorProperty: new ProfileColorProperty( 'harmonic4Color', {
    default: new Color( 0, 255, 0 )
  } ),

  harmonic5ColorProperty: new ProfileColorProperty( 'harmonic5Color', {
    default: new Color( 0, 201, 87 )
  } ),

  harmonic6ColorProperty: new ProfileColorProperty( 'harmonic6Color', {
    default: new Color( 100, 149, 237 )
  } ),

  harmonic7ColorProperty: new ProfileColorProperty( 'harmonic7Color', {
    default: new Color( 0, 0, 255 )
  } ),

  harmonic8ColorProperty: new ProfileColorProperty( 'harmonic8Color', {
    default: new Color( 0, 0, 128 )
  } ),

  harmonic9ColorProperty: new ProfileColorProperty( 'harmonic9Color', {
    default: new Color( 145, 33, 158 )
  } ),

  harmonic10ColorProperty: new ProfileColorProperty( 'harmonic10Color', {
    default: new Color( 186, 85, 211 )
  } ),

  harmonic11ColorProperty: new ProfileColorProperty( 'harmonic11Color', {
    default: new Color( 255, 105, 180 )
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

/**
 * Gets the color Property for a harmonic.
 * @param {number} order - order of the harmonic
 * @returns {Property.<Color>}
 */
FMWColors.getHarmonicColorProperty = order => {
  assert && AssertUtils.assertPositiveInteger( order );
  const propertyName = `harmonic${order}ColorProperty`;
  assert && assert( FMWColors.hasOwnProperty( propertyName ), `invalid order: ${order}` );
  return FMWColors[ propertyName ];
};

fourierMakingWaves.register( 'FMWColors', FMWColors );
export default FMWColors;
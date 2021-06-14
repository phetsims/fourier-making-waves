// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevelSelectionButton is a level-selection button for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Harmonic from '../../common/model/Harmonic.js';
import AmplitudeSlider from '../../common/view/AmplitudeSlider.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

class WaveGameLevelSelectionButton extends LevelSelectionButton {

  /**
   * @param {WaveGameLevel} level
   * @param {number} numberOfLevels
   * @param {Property.<WaveGameLevel|null} levelProperty
   * @param {Object} [options]
   */
  constructor( level, numberOfLevels, levelProperty, options ) {

    assert && assert( level instanceof WaveGameLevel );
    assert && AssertUtils.assertPositiveNumber( numberOfLevels );
    assert && assert( levelProperty instanceof Property );

    options = merge( {

      // LevelSelectionButton options
      buttonWidth: 150,
      buttonHeight: 150,
      xMargin: 10,
      yMargin: 10,
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      baseColor: FMWColorProfile.levelSelectionButtonFillProperty,
      listener: () => {
        levelProperty.value = level;
      }
    }, options );

    const maxIconWidth = options.buttonWidth - ( 2 * options.xMargin );
    const maxIconHeight = options.buttonHeight - ( 2 * options.yMargin );
    const icon = createIcon( level.levelNumber, maxIconWidth, maxIconHeight, numberOfLevels );

    super( icon, level.scoreProperty, options );

    // @public
    this.level = level;
  }
}

//TODO lots of duplication with createHomeScreenIcon
/**
 * Creates an icon for a game level. It shows amplitude sliders, where the number of sliders equals the level number.
 * @param {number} levelNumber
 * @param {number} maxIconWidth
 * @param {number} maxIconHeight
 * @param {number} numberOfLevels
 * @returns {Node}
 */
function createIcon( levelNumber, maxIconWidth, maxIconHeight, numberOfLevels ) {

  const amplitudeRange = new Range( -1, 1 );

  // Amplitudes for each slider shown in the icon.
  const possibleAmplitudes = [ 1, 0.5, 0.75, 1, 0.85 ];
  assert && assert( possibleAmplitudes.length < FMWConstants.MAX_HARMONICS );
  assert && assert( _.every( possibleAmplitudes, amplitude => amplitudeRange.contains( amplitude ) ) );

  const amplitudes = possibleAmplitudes.slice( 0, levelNumber );

  // Create harmonics
  const harmonics = [];
  for ( let order = 1; order <= amplitudes.length; order++ ) {
    harmonics.push( new Harmonic( {
      order: order,
      frequency: 1,
      wavelength: 1,
      amplitudeRange: amplitudeRange,
      amplitude: amplitudes[ order - 1 ],
      colorProperty: FMWColorProfile.getHarmonicColorProperty( order ),
      tandem: Tandem.OPT_OUT
    } ) );
  }

  // Create sliders
  const emphasizedHarmonics = new EmphasizedHarmonics();
  const sliders = new HBox( {
    spacing: 10,
    children: _.map( harmonics, harmonic => new AmplitudeSlider( harmonic, emphasizedHarmonics ), {
      tandem: Tandem.OPT_OUT
    } ),
    maxWidth: maxIconWidth,
    maxHeight: maxIconHeight
  } );

  // Create x axis
  const xMargin = 20;
  const xAxis = new Line( -xMargin, sliders.height / 2, sliders.width + xMargin, sliders.height / 2, {
    stroke: FMWColorProfile.axisStrokeProperty,
    lineWidth: 2
  } );

  // Level number
  const levelString = ( levelNumber === numberOfLevels ) ? `${levelNumber}+` : `${levelNumber}`;
  const levelNode = new Text( levelString, {
    font: new PhetFont( 200 ),
    maxHeight: 0.4 * maxIconHeight,
    centerX: sliders.centerX,
    top: xAxis.bottom + 10
  } );

  return new Node( {
    children: [ xAxis, sliders, levelNode ],
    pdomVisible: false
  } );
}

fourierMakingWaves.register( 'WaveGameLevelSelectionButton', WaveGameLevelSelectionButton );
export default WaveGameLevelSelectionButton;
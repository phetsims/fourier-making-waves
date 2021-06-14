// Copyright 2021, University of Colorado Boulder

/**
 * FMWIconFactory contains factory methods for creating the icons needed throughout the user interface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import wavePacketHomeScreenImage from '../../../images/Wave-Packet-home-screen-icon_png.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import PointsAwardedNode from '../../waveGame/view/PointsAwardedNode.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeSlider from './AmplitudeSlider.js';

const FMWIconFactory = {

  /**
   * Creates an icon that contains one or more amplitude spinners, with an x axis.
   * @param {number[]} amplitudes
   * @param {Range} amplitudeRange
   * @param {Object} [options]
   */
  createSlidersIcon( amplitudes, amplitudeRange, options ) {

    assert && assert( amplitudes.length < FMWConstants.MAX_HARMONICS );
    assert && assert( _.every( amplitudes, amplitude => amplitudeRange.contains( amplitude ) ) );

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
      } )
    } );

    // x axis
    const xMargin = 10;
    const xAxis = new Line( -xMargin, sliders.height / 2, sliders.width + xMargin, sliders.height / 2, {
      stroke: FMWColorProfile.axisStrokeProperty,
      lineWidth: 2
    } );

    //TODO Consider using node.rasterized( { resolution: 2 } ) to avoid memory, phet-io, and pdom issues
    // associated with all of the above elements.
    return new Node( merge( {}, {
      children: [ xAxis, sliders ],
      pdomVisible: false // so that focus traversal does not visit subcomponents of this icon
    }, options ) );
  },

  /**
   * Creates the Home screen icon for the 'Discrete' screen.
   * @returns {ScreenIcon}
   */
  createDiscreteHomeScreenIcon() {
    // AmplitudeSlider requires the range to be symmetric. So we're using a mixture of positive and negative
    // amplitudes to fill the vertical space.
    const amplitudes = [ 1, -0.85, 0.65, 0.3 ];
    const amplitudeRange = new Range( -1, 1 );
    const iconNode = FMWIconFactory.createSlidersIcon( amplitudes, amplitudeRange );
    return new ScreenIcon( iconNode, {
      fill: FMWColorProfile.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the Home screen icon for the 'Wave Game' screen.
   * @returns {ScreenIcon}
   */
  createWaveGameHomeScreenIcon() {
    const iconNode = new PointsAwardedNode();
    return new ScreenIcon( iconNode, {
      fill: FMWColorProfile.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the Home screen icon for the 'Wave Packet' screen.
   * @returns {ScreenIcon}
   */
  createWavePacketHomeScreenIcon() {
    const iconNode = new Image( wavePacketHomeScreenImage );
    return new ScreenIcon( iconNode, {
      fill: FMWColorProfile.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the icon that appears on a level-selection button in Wave Game.
   * It shows amplitude sliders, where the number of sliders equals the level number.
   * @param {number} levelNumber
   * @param {number} numberOfLevels
   * @returns {Node}
   */
  createLevelSelectionButtonIcon( levelNumber, numberOfLevels ) {

    // AmplitudeSlider requires the range to be symmetric. We're only going to use positive amplitudes here,
    // so that the level number can be centered in the space below the x axis.
    const possibleAmplitudes = [ 1, 0.5, 0.75, 1, 0.85 ];
    assert && assert( numberOfLevels <= possibleAmplitudes.length );
    assert && assert( _.every( possibleAmplitudes, amplitude => amplitude > 0 ) );

    const amplitudeRange = new Range( -1, 1 );
    const amplitudes = possibleAmplitudes.slice( 0, levelNumber );

    // Pick some values that look nice. Generally the icons should be wider than they are tall.
    const iconWidth = 200;
    const iconHeight = 150;

    // Invisible rectangle, for constraining and laying out other subcomponents.
    const rectangle = new Rectangle( 0, 0, iconWidth, iconHeight );

    // Create sliders
    const slidersIcon = FMWIconFactory.createSlidersIcon( amplitudes, amplitudeRange, {
      maxWidth: rectangle.width,
      maxHeight: rectangle.height,
      center: rectangle.center
    } );

    // Level number
    const levelString = ( levelNumber === numberOfLevels ) ? `${levelNumber}+` : `${levelNumber}`;
    const levelNode = new Text( levelString, {
      font: new PhetFont( 200 ),
      maxWidth: rectangle.width,
      maxHeight: 0.4 * rectangle.height,
      centerX: rectangle.centerX,
      bottom: rectangle.bottom
    } );

    return new Node( {
      children: [ rectangle, slidersIcon, levelNode ],
      pdomVisible: false // so that focus traversal does not visit subcomponents of this icon
    } );
  }
};

fourierMakingWaves.register( 'FMWIconFactory', FMWIconFactory );
export default FMWIconFactory;
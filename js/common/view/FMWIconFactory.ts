// Copyright 2021-2025, University of Colorado Boulder

/**
 * FMWIconFactory contains factory methods for creating the icons needed throughout this sim's user interface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Line, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import wavePacketHomeScreenIcon_png from '../../../images/wavePacketHomeScreenIcon_png.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import PointsAwardedNode from '../../waveGame/view/PointsAwardedNode.js';
import HorizontalDimensionalArrowsNode from '../../wavepacket/view/HorizontalDimensionalArrowsNode.js';
import FMWColors from '../FMWColors.js';
import FMWConstants from '../FMWConstants.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeSlider from './AmplitudeSlider.js';

const FMWIconFactory = {

  /**
   * Creates the Home screen icon for the 'Discrete' screen.
   */
  createDiscreteHomeScreenIcon(): ScreenIcon {

    // AmplitudeSlider requires the range to be symmetric. So use a mixture of positive and negative
    // amplitudes to fill the vertical space.
    const amplitudes = [ 1, -0.85, 0.65, 0.3 ];
    const amplitudeRange = new Range( -1, 1 );
    const iconNode = createSlidersIcon( amplitudes, amplitudeRange );
    return new ScreenIcon( iconNode, {
      fill: FMWColors.discreteScreenBackgroundColorProperty
    } );
  },

  /**
   * Creates the Home screen icon for the 'Wave Game' screen.
   */
  createWaveGameHomeScreenIcon(): ScreenIcon {
    const iconNode = new PointsAwardedNode( {
      tandem: Tandem.OPT_OUT
    } );
    return new ScreenIcon( iconNode, {
      fill: FMWColors.waveGameScreenBackgroundColorProperty
    } );
  },

  /**
   * Creates the Home screen icon for the 'Wave Packet' screen.
   */
  createWavePacketHomeScreenIcon(): ScreenIcon {
    const iconNode = new Image( wavePacketHomeScreenIcon_png );
    return new ScreenIcon( iconNode, {
      fill: FMWColors.wavePacketScreenBackgroundColorProperty
    } );
  },

  /**
   * Creates the icon that appears on a level-selection button in the Wave Game screen.
   * It shows amplitude sliders, where the number of sliders equals the level number.
   */
  createLevelSelectionButtonIcon( levelNumber: number, numberOfLevels: number ): Node {

    // AmplitudeSlider requires the range to be symmetric. We use only positive amplitudes here,
    // so that the level number can be centered in the space below the x-axis.
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
    const slidersIcon = createSlidersIcon( amplitudes, amplitudeRange, {
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
  },

  /**
   * Creates the icon for the 'Width Indicators' checkbox
   */
  createWidthIndicatorsIcon(): Node {
    const icon = new HorizontalDimensionalArrowsNode( FMWColors.widthIndicatorsColorProperty );
    icon.setLine( 0, 45 );
    return icon;
  }
};

/**
 * Creates an icon that contains one or more amplitude spinners, with an x-axis.
 */
function createSlidersIcon( amplitudes: number[], amplitudeRange: Range, options?: StrictOmit<NodeOptions, 'children'> ): Node {

  assert && assert( amplitudes.length < FMWConstants.MAX_HARMONICS );
  assert && assert( _.every( amplitudes, amplitude => amplitudeRange.contains( amplitude ) ) );

  // Create harmonics
  const harmonics = amplitudes.map( ( amplitude, index ) => new Harmonic( {
    order: index + 1,
    frequency: 1,
    wavelength: 1,
    amplitudeRange: amplitudeRange,
    amplitude: amplitude,
    colorProperty: FMWColors.HARMONIC_COLOR_PROPERTIES[ index ],
    tandem: Tandem.OPT_OUT
  } ) );

  // Create sliders
  const emphasizedHarmonics = new EmphasizedHarmonics();
  const sliders = harmonics.map( harmonic => AmplitudeSlider.createIcon( harmonic, emphasizedHarmonics ) );

  // Layout sliders horizontally
  const hBox = new HBox( {
    spacing: 10,
    children: sliders
  } );

  // x-axis
  const xMargin = 10;
  const xAxis = new Line( -xMargin, hBox.height / 2, hBox.width + xMargin, hBox.height / 2, {
    stroke: FMWColors.axisStrokeProperty,
    lineWidth: 2
  } );

  // Note that we could use rasterized( { resolution: 2 } ) to avoid memory, phet-io, and pdom issues
  // associated with all of the above elements. But the quality of the rendering is not as good.
  return new Node( combineOptions<NodeOptions>( {}, {
    children: [ xAxis, hBox ]
  }, options ) );
}

fourierMakingWaves.register( 'FMWIconFactory', FMWIconFactory );
export default FMWIconFactory;
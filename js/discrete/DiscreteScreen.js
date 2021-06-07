// Copyright 2020-2021, University of Colorado Boulder

/**
 * DiscreteScreen is the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Range from '../../../dot/js/Range.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import SliderAndGeneralKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Line from '../../../scenery/js/nodes/Line.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColorProfile from '../common/FMWColorProfile.js';
import FMWConstants from '../common/FMWConstants.js';
import EmphasizedHarmonics from '../common/model/EmphasizedHarmonics.js';
import Harmonic from '../common/model/Harmonic.js';
import AmplitudeSlider from '../common/view/AmplitudeSlider.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import DiscreteModel from './model/DiscreteModel.js';
import DiscreteScreenView from './view/DiscreteScreenView.js';

class DiscreteScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Screen options
      name: fourierMakingWavesStrings.screen.discrete,
      backgroundColorProperty: FMWColorProfile.screenBackgroundColorProperty,
      homeScreenIcon: createHomeScreenIcon(),

      // pdom
      keyboardHelpNode: new SliderAndGeneralKeyboardHelpContent( {
        labelMaxWidth: 250,
        generalSectionOptions: {
          withCheckboxContent: true
        }
      } ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new DiscreteModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new DiscreteScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

//TODO all of the things used herein need to be tandem:Tandem.OPTIONAL
/**
 * Creates the Home screen icon for this screen.
 * @returns {ScreenIcon}
 */
function createHomeScreenIcon() {

  const amplitudeRange = new Range( -1, 1 );

  // Amplitudes for each slider shown in the icon.
  const amplitudes = [ 1, -0.85, 0.65, 0.3 ];
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
      colorProperty: FMWColorProfile.getHarmonicColorProperty( order )
    } ) );
  }

  // Create sliders
  const emphasizedHarmonics = new EmphasizedHarmonics();
  const sliders = new HBox( {
    spacing: 10,
    children: _.map( harmonics, harmonic => new AmplitudeSlider( harmonic, emphasizedHarmonics ) )
  } );

  // Create grid lines
  const xMargin = 20;
  const xAxis = new Line( -xMargin, sliders.height / 2, sliders.width + xMargin, sliders.height / 2, {
    stroke: FMWColorProfile.axisStrokeProperty,
    lineWidth: 2
  } );

  const iconNode = new Node( {
    children: [ xAxis, sliders ]
  } );

  return new ScreenIcon( iconNode, {
    fill: FMWColorProfile.screenBackgroundColorProperty
  } );
}

fourierMakingWaves.register( 'DiscreteScreen', DiscreteScreen );
export default DiscreteScreen;
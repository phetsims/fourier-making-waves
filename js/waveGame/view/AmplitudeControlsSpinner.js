// Copyright 2021, University of Colorado Boulder

/**
 * AmplitudeControlsSpinner is a labeled spinner used to control the number of amplitude sliders shown in a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class AmplitudeControlsSpinner extends Node {

  /**
   * @param {NumberProperty} numberOfAmplitudeControlsProperty
   * @param {Object} [options]
   */
  constructor( numberOfAmplitudeControlsProperty, options ) {
    assert && assert( numberOfAmplitudeControlsProperty instanceof NumberProperty, 'invalid numberOfAmplitudeControlsProperty' );

    options = merge( {
      spinnerOptions: FMWConstants.SPINNER_OPTIONS,
      textOptions: {
        font: new PhetFont( 16 ),
        maxWidth: 200
      }
    }, options );

    const amplitudeControlsText = new Text( fourierMakingWavesStrings.amplitudeControls, options.textOptions );

    const spinner = new NumberSpinner( numberOfAmplitudeControlsProperty, numberOfAmplitudeControlsProperty.rangeProperty,
      options.spinnerOptions );

    const hBox = new HBox( {
      spacing: 8,
      children: [ amplitudeControlsText, spinner ]
    } );

    assert && assert( !options.children, 'AmplitudeControlsSpinner sets children' );
    options.children = [ hBox ];

    super( options );
  }
}

fourierMakingWaves.register( 'AmplitudeControlsSpinner', AmplitudeControlsSpinner );
export default AmplitudeControlsSpinner;
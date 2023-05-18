// Copyright 2021-2023, University of Colorado Boulder

/**
 * AmplitudeControlsSpinner is a labeled spinner used to control the number of amplitude sliders shown in a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class AmplitudeControlsSpinner extends VBox {

  /**
   * @param {NumberProperty} numberOfAmplitudeControlsProperty
   * @param {Object} [options]
   */
  constructor( numberOfAmplitudeControlsProperty, options ) {
    assert && assert( numberOfAmplitudeControlsProperty instanceof NumberProperty );

    options = merge( {

      // NumberSpinner options
      spinnerOptions: {
        arrowsPosition: 'leftRight',
        numberDisplayOptions: {
          align: 'center',
          xMargin: 8,
          yMargin: 2,
          cornerRadius: 3,
          textOptions: {
            font: new PhetFont( 14 )
          }
        },
        touchAreaXDilation: 25,
        touchAreaYDilation: 12,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5
      },

      // Text options
      textOptions: {
        maxWidth: 120
      },

      // VBox options
      spacing: 10
    }, options );

    const amplitudeControlsText = new Text( FourierMakingWavesStrings.amplitudeControlsStringProperty,
      merge( {
        tandem: options.tandem.createTandem( 'amplitudeControlsText' )
      }, options.textOptions ) );

    const spinner = new NumberSpinner( numberOfAmplitudeControlsProperty, numberOfAmplitudeControlsProperty.rangeProperty,
      merge( {
        tandem: options.tandem.createTandem( 'spinner' )
      }, options.spinnerOptions ) );

    assert && assert( !options.children, 'AmplitudeControlsSpinner sets children' );
    options.children = [ amplitudeControlsText, spinner ];

    super( options );
  }
}

fourierMakingWaves.register( 'AmplitudeControlsSpinner', AmplitudeControlsSpinner );
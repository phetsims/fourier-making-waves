// Copyright 2021-2023, University of Colorado Boulder

/**
 * AmplitudeControlsSpinner is a labeled spinner used to control the number of amplitude sliders shown in a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

type SelfOptions = {
  textOptions?: StrictOmit<TextOptions, 'tandem'>;
};

type AmplitudeControlsSpinnerOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class AmplitudeControlsSpinner extends VBox {

  public constructor( numberOfAmplitudeControlsProperty: NumberProperty, providedOptions: AmplitudeControlsSpinnerOptions ) {

    const options = optionize<AmplitudeControlsSpinnerOptions, SelfOptions, VBoxOptions>()( {

      // SelfOptions
      textOptions: {
        maxWidth: 120
      },

      // VBoxOptions
      spacing: 10
    }, providedOptions );

    const amplitudeControlsText = new Text( FourierMakingWavesStrings.amplitudeControlsStringProperty, options.textOptions );

    const spinner = new NumberSpinner( numberOfAmplitudeControlsProperty, numberOfAmplitudeControlsProperty.rangeProperty, {
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
      mouseAreaYDilation: 5,
      tandem: options.tandem.createTandem( 'spinner' )
    } );

    options.children = [ amplitudeControlsText, spinner ];

    super( options );
  }
}

fourierMakingWaves.register( 'AmplitudeControlsSpinner', AmplitudeControlsSpinner );
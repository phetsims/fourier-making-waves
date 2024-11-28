// Copyright 2020-2024, University of Colorado Boulder

/**
 * HarmonicsSpinner is the spinner used to set the number of harmonics in the Fourier series. It appears in the
 * 'Discrete' screen's control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class HarmonicsSpinner extends NumberSpinner {

  public constructor( numberOfHarmonicsProperty: NumberProperty, tandem: Tandem ) {

    super( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, {

      // NumberSpinner options
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
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'HarmonicsSpinner', HarmonicsSpinner );
// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsSpinner is the spinner used to set the number of harmonics in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class HarmonicsSpinner extends NumberSpinner {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );

    options = merge( {
      arrowPosition: 'bothRight',
      numberDisplayOptions: {
        align: 'center',
        xMargin: 8,
        yMargin: 5,
        cornerRadius: 3,
        textOptions: {
          font: new PhetFont( 16 )
        }
      },
      touchAreaXDilation: 20,
      touchAreaYDilation: 8,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 5
    }, options );

    super( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, options );
  }
}

fourierMakingWaves.register( 'HarmonicsSpinner', HarmonicsSpinner );
export default HarmonicsSpinner;
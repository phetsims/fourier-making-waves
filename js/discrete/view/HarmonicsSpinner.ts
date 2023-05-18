// Copyright 2020-2023, University of Colorado Boulder

/**
 * HarmonicsSpinner is the spinner used to set the number of harmonics in the Fourier series. It appears in the
 * 'Discrete' screen's control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class HarmonicsSpinner extends NumberSpinner {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty );

    options = merge( {

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
      mouseAreaYDilation: 5
    }, options );

    super( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, options );
  }
}

fourierMakingWaves.register( 'HarmonicsSpinner', HarmonicsSpinner );
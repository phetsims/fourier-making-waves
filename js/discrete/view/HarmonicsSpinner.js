// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsSpinner is the spinner used to set the number of harmonics in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class HarmonicsSpinner extends NumberSpinner {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );

    options = merge( {}, FMWConstants.SPINNER_OPTIONS, options );

    super( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, options );
  }
}

fourierMakingWaves.register( 'HarmonicsSpinner', HarmonicsSpinner );
export default HarmonicsSpinner;
// Copyright 2020, University of Colorado Boulder

/**
 * OrderSpinner is a spinner for selecting harmonic order.
 * It's used to select wavelength and period for the measurement tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class OrderSpinner extends NumberSpinner {

  /**
   * @param {string} symbol - order is displayed as the subscript of this symbol
   * @param {NumberProperty} orderProperty - the order of the associated harmonic
   * @param {Object} [options]
   */
  constructor( symbol, orderProperty, options ) {

    assert && assert( typeof symbol === 'string', 'invalid symbol' );
    assert && assert( orderProperty instanceof NumberProperty, 'invalid orderProperty' );

    options = merge( {
      arrowsPosition: 'leftRight',
      arrowsScale: 0.85,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      numberDisplayOptions: {
        useRichText: true,
        numberFormatter: order => `${symbol}<sub>${order}</sub>`,
        cornerRadius: 3,
        textOptions: {
          font: FMWConstants.CONTROL_FONT,
          maxWidth: 50 // determined empirically
        }
      }
    }, options );

    super( orderProperty, orderProperty.rangeProperty, options );
  }
}

fourierMakingWaves.register( 'OrderSpinner', OrderSpinner );
export default OrderSpinner;
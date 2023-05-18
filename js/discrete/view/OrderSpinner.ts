// Copyright 2020-2023, University of Colorado Boulder

/**
 * OrderSpinner is a spinner for selecting harmonic order.
 * It's used to select wavelength and period for the measurement tools on the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class OrderSpinner extends NumberSpinner {

  /**
   * @param {TReadOnlyProperty.<string>} symbolStringProperty - order is displayed as the subscript of this symbol
   * @param {NumberProperty} orderProperty - the order of the associated harmonic
   * @param {Object} [options]
   */
  constructor( symbolStringProperty, orderProperty, options ) {

    assert && assert( orderProperty instanceof NumberProperty );

    options = merge( {

      // NumberSpinner options
      arrowsPosition: 'leftRight',
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      numberDisplayOptions: {
        useRichText: true,
        align: 'center',
        cornerRadius: 3,
        xMargin: 8,
        yMargin: 2,
        textOptions: {
          font: FMWConstants.MATH_CONTROL_FONT,
          maxWidth: 50 // determined empirically
        }
      }
    }, options );

    super( orderProperty, orderProperty.rangeProperty, options );

    symbolStringProperty.link( symbol => this.setNumberFormatter( order => `${symbol}<sub>${order}</sub>` ) );
  }
}

fourierMakingWaves.register( 'OrderSpinner', OrderSpinner );
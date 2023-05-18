// Copyright 2020-2023, University of Colorado Boulder

/**
 * OrderSpinner is a spinner for selecting harmonic order.
 * It's used to select wavelength and period for the measurement tools on the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type OrderSpinnerOptions = SelfOptions & PickRequired<NumberSpinner, 'enabledProperty' | 'tandem'>;

export default class OrderSpinner extends NumberSpinner {

  /**
   * @param symbolStringProperty - order is displayed as the subscript of this symbol
   * @param orderProperty - the order of the associated harmonic
   * @param [providedOptions]
   */
  public constructor( symbolStringProperty: TReadOnlyProperty<string>, orderProperty: NumberProperty, providedOptions: OrderSpinnerOptions ) {

    const options = optionize<OrderSpinnerOptions, SelfOptions, NumberSpinnerOptions>()( {

      // NumberSpinnerOptions
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
    }, providedOptions );

    super( orderProperty, orderProperty.rangeProperty, options );

    symbolStringProperty.link( symbol => this.setNumberFormatter( order => `${symbol}<sub>${order}</sub>` ) );
  }
}

fourierMakingWaves.register( 'OrderSpinner', OrderSpinner );
// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteMeasurementTool is the model for a measurement tool in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class DiscreteMeasurementTool {

  /**
   * @param {TReadOnlyProperty.<string>} symbolStringProperty
   * @param {NumberProperty} numberOfHarmonicsProperty - number of relevant harmonics in the Fourier series
   * @param {Object} [options]
   */
  constructor( symbolStringProperty, numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.symbolStringProperty = symbolStringProperty;

    // @public whether the Wavelength tool is selected
    this.isSelectedProperty = new BooleanProperty( false, {
      phetioDocumentation: 'whether this tool is selected',
      tandem: options.tandem.createTandem( 'isSelectedProperty' )
    } );

    // @public order of the harmonic measured by the tool
    this.orderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, numberOfHarmonicsProperty.value ),
      phetioDocumentation: 'order of the harmonic that this tool is measuring',
      tandem: options.tandem.createTandem( 'orderProperty' )
    } );

    numberOfHarmonicsProperty.link( numberOfHarmonics => {

      // Adjust the tool when a harmonic becomes irrelevant.
      if ( this.orderProperty.value > numberOfHarmonics ) {

        // Deselect the tool.
        this.isSelectedProperty.value = false;

        // Associate the tool with the highest-order harmonic.
        this.orderProperty.value = numberOfHarmonics;
      }

      // Keep the order range in sync with the number of relevant harmonics.
      this.orderProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
    } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * @public
   */
  reset() {
    this.isSelectedProperty.reset();
    this.orderProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteMeasurementTool', DiscreteMeasurementTool );
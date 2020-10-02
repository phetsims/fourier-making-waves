// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import merge from '../../../../phet-core/js/merge.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesConstants from '../FourierMakingWavesConstants.js';

class FourierSeries {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      fundamentalFrequency: 440, // Hz
      numberOfHarmonics: 1
    }, options );

    // @public (read-only)
    this.fundamentalFrequency = options.fundamentalFrequency;

    // @public
    this.numberOfHarmonicsProperty = new NumberProperty( options.numberOfHarmonics, {
      numberType: 'Integer',
      range: FourierMakingWavesConstants.NUMBER_OF_HARMONICS_RANGE
    } );

    // @public (read-only) {ObservableArray.<NumberProperty>} one amplitudeProperty for each harmonic, in harmonic order.
    // 'Order' is the array index + 1. The fundamental is the first-order harmonic, etc.
    this.amplitudeProperties = createObservableArray();

    // unlink is not necessary
    this.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      if ( numberOfHarmonics > this.amplitudeProperties.length ) {

        // delete some harmonics
        while ( this.amplitudeProperties.length > numberOfHarmonics ) {
          this.amplitudeProperties.pop().dispose();
        }
      }
      else {
        while ( this.amplitudeProperties.length < numberOfHarmonics ) {

          // add some harmonics
          this.amplitudeProperties.push( new NumberProperty( 0, {
            range: FourierMakingWavesConstants.AMPLITUDE_RANGE
          } ) );
        }
      }
    } );
  }

  /**
   * @public
   */
  dispose() {
    this.numberOfHarmonicsProperty.dispose();
    while ( this.amplitudeProperties.length > 0 ) {
      this.amplitudeProperties.pop().dispose();
    }
  }

  /**
   * @public
   */
  reset() {
    this.numberOfHarmonicsProperty.reset();
    this.amplitudeProperties.forEach( amplitudeProperty => amplitudeProperty.reset() );
  }
}

fourierMakingWaves.register( 'FourierSeries', FourierSeries );
export default FourierSeries;
// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesColors from '../FourierMakingWavesColors.js';
import FourierMakingWavesConstants from '../FourierMakingWavesConstants.js';
import Harmonic from './Harmonic.js';

class FourierSeries {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );
    assert && assert( numberOfHarmonicsProperty.range, 'numberOfHarmonicsProperty.range is required' );
    assert && assert( numberOfHarmonicsProperty.range.max === FourierMakingWavesColors.HARMONIC_COLOR_PROPERTIES.length,
      'a color is required for each harmonic' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only) frequency of the fundamental (1st harmonic) in Hz
    this.fundamentalFrequency = 440;

    // @public {Harmonic[]}
    this.harmonics = [];
    for ( let i = 0; i < numberOfHarmonicsProperty.range.max; i++ ) {
      this.harmonics.push( new Harmonic( i + 1, FourierMakingWavesColors.HARMONIC_COLOR_PROPERTIES[ i ], {
        range: FourierMakingWavesConstants.AMPLITUDE_RANGE,
        tandem: options.tandem.createTandem( `harmonic${i+1}` )
      } ) );
    }

    // Reset amplitudes that are not relevant. unlink is not necessary.
    numberOfHarmonicsProperty.link( numberOfHarmonics => {
      for ( let i = numberOfHarmonics; i < numberOfHarmonicsProperty.range.max; i++ ) {
        this.harmonics[ i ].reset();
      }
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
    this.harmonics.forEach( harmonic => harmonic.reset() );
  }
}

fourierMakingWaves.register( 'FourierSeries', FourierSeries );
export default FourierSeries;
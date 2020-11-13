// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesColors from '../FourierMakingWavesColors.js';
import Harmonic from './Harmonic.js';

class FourierSeries extends PhetioObject {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );
    assert && assert( numberOfHarmonicsProperty.range, 'numberOfHarmonicsProperty.range is required' );

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only) frequency of the fundamental (1st harmonic) in Hz
    this.fundamentalFrequency = 440;

    // @public (read-only)
    //TODO why 1.27 ?
    this.amplitudeRange = new Range( -1.27, 1.27 );

    // @public {Harmonic[]} with order numbered from 1
    this.harmonics = [];
    for ( let order = 1; order <= numberOfHarmonicsProperty.range.max; order++ ) {
      const color = FourierMakingWavesColors.getHarmonicColor( order );
      this.harmonics.push( new Harmonic( order, color, this.amplitudeRange, {
        range: this.amplitudeRange,
        tandem: options.tandem.createTandem( `harmonic${order}` )
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
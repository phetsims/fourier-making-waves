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
import FourierMakingWavesColorProfile from '../FourierMakingWavesColorProfile.js';
import Harmonic from './Harmonic.js';

// constants
const MAX_ABSOLUTE_AMPLITUDE = 4 / Math.PI; //TODO why? see https://github.com/phetsims/fourier-making-waves/issues/11

class FourierSeries extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only) frequency of the fundamental (1st harmonic) in Hz
    this.fundamentalFrequency = 440;

    // @public (read-only)
    this.amplitudeRange = new Range( -MAX_ABSOLUTE_AMPLITUDE, MAX_ABSOLUTE_AMPLITUDE );

    // @public the number of harmonics in this series
    this.numberOfHarmonicsProperty = new NumberProperty( 1, {
      range: new Range( 1, 11 ),
      tandem: options.tandem.createTandem( 'numberOfHarmonicsProperty' )
    } );

    // @public {Harmonic[]} with order numbered from 1
    this.harmonics = [];
    for ( let order = 1; order <= this.numberOfHarmonicsProperty.range.max; order++ ) {
      const colorProperty = FourierMakingWavesColorProfile.getHarmonicColorProperty( order );
      this.harmonics.push( new Harmonic( order, colorProperty, this.amplitudeRange, {
        range: this.amplitudeRange,
        tandem: options.tandem.createTandem( `harmonic${order}` )
      } ) );
    }

    // Reset amplitudes that are not relevant. unlink is not necessary.
    this.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      for ( let i = numberOfHarmonics; i < this.numberOfHarmonicsProperty.range.max; i++ ) {
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
    this.numberOfHarmonicsProperty.reset();
    this.harmonics.forEach( harmonic => harmonic.reset() );
  }
}

fourierMakingWaves.register( 'FourierSeries', FourierSeries );
export default FourierSeries;
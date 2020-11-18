// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import Harmonic from './Harmonic.js';

// constants
const MAX_HARMONICS = 11;
//TODO why? see https://github.com/phetsims/fourier-making-waves/issues/11
const MAX_ABSOLUTE_AMPLITUDE = Utils.toFixedNumber( 4 / Math.PI, FMWConstants.AMPLITUDE_DECIMAL_PLACES );

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
    this.numberOfHarmonicsProperty = new NumberProperty( MAX_HARMONICS, {
      range: new Range( 1, MAX_HARMONICS ),
      tandem: options.tandem.createTandem( 'numberOfHarmonicsProperty' )
    } );

    // @public {Harmonic[]} with order numbered from 1
    this.harmonics = [];
    for ( let order = 1; order <= this.numberOfHarmonicsProperty.range.max; order++ ) {
      const colorProperty = FMWColorProfile.getHarmonicColorProperty( order );
      this.harmonics.push( new Harmonic( order, colorProperty, this.amplitudeRange, {
        amplitude: ( order === 1 ) ? 1 : 0,
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
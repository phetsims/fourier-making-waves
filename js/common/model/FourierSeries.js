// Copyright 2020, University of Colorado Boulder

/**
 * FourierSeries is the model of a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColorProfile from '../FMWColorProfile.js';
import Harmonic from './Harmonic.js';

// constants
const MAX_HARMONICS = 11;

// The amplitude range is [-4/pi, 4/pi] because of the factor of 4/pi in the Fourier series of a square wave.
// For n=1, the amplitude is 4/pi. See https://mathworld.wolfram.com/FourierSeriesSquareWave.html and
// https://github.com/phetsims/fourier-making-waves/issues/11
const MAX_ABSOLUTE_AMPLITUDE = 4 / Math.PI;

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

    // @public {Harmonic[]} an instance for each possible harmonic, with order numbered from 1.
    // All possible harmonics are created eagerly, and only the relevant ones should be considered, based on
    // numberOfHarmonicsProperty. This was a fundamental team decision, based on anticipated PhET-iO requirements.
    // See https://github.com/phetsims/fourier-making-waves/issues/6.
    this.harmonics = [];
    for ( let order = 1; order <= this.numberOfHarmonicsProperty.range.max; order++ ) {
      const colorProperty = FMWColorProfile.getHarmonicColorProperty( order );
      this.harmonics.push( new Harmonic( order, colorProperty, this.amplitudeRange, {
        range: this.amplitudeRange,
        tandem: options.tandem.createTandem( `harmonic${order}` )
      } ) );
    }

    // @public {DerivedProperty.<number[]>} amplitudesProperty - amplitudes for the relevant harmonics
    // This was requested for the PhET-iO API.
    this.amplitudesProperty = new DerivedProperty(
      [ this.numberOfHarmonicsProperty, ..._.map( this.harmonics, harmonic => harmonic.amplitudeProperty ) ],
      numberOfHarmonics => {
        const amplitudes = [];
        for ( let i = 0; i < numberOfHarmonics; i++ ) {
          amplitudes.push( this.harmonics[ i ].amplitudeProperty.value );
        }
        return amplitudes;
      }, {
        phetioType: DerivedProperty.DerivedPropertyIO( ArrayIO( NumberIO ) ),
        tandem: options.tandem.createTandem( 'amplitudesProperty' )
      } );

    // Zero out amplitudes that are not relevant. unlink is not necessary.
    this.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      for ( let i = numberOfHarmonics; i < this.numberOfHarmonicsProperty.range.max; i++ ) {
        this.harmonics[ i ].amplitudeProperty.value = 0;
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
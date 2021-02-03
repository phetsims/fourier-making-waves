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
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Domain from '../../discrete/model/Domain.js';
import SeriesType from '../../discrete/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import Harmonic from './Harmonic.js';

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

    // @public (read-only) properties of the fundamental (first, n=1) harmonic
    this.fundamentalFrequency = 440;  // frequency, in Hz
    this.fundamentalPeriod = 1000 / this.fundamentalFrequency; // period, in milliseconds
    this.fundamentalWavelength = 1; //  wavelength, in meters

    // @public (read-only) aliases that correspond to symbols used in equations
    this.f1 = this.fundamentalFrequency;
    this.L = this.fundamentalWavelength;
    this.T = this.fundamentalPeriod;

    // @public (read-only)
    this.amplitudeRange = new Range( -FMWConstants.MAX_ABSOLUTE_AMPLITUDE, FMWConstants.MAX_ABSOLUTE_AMPLITUDE );

    // @public the number of harmonics in this series
    this.numberOfHarmonicsProperty = new NumberProperty( FMWConstants.MAX_HARMONICS, {
      numberType: 'Integer',
      range: new Range( 1, FMWConstants.MAX_HARMONICS ),
      tandem: options.tandem.createTandem( 'numberOfHarmonicsProperty' )
    } );

    // @public {Harmonic[]} an instance for each possible harmonic, with order numbered from 1.
    // All possible harmonics are created eagerly, and only the relevant ones should be considered, based on
    // numberOfHarmonicsProperty. This was a fundamental team decision, based on anticipated PhET-iO requirements.
    // See https://github.com/phetsims/fourier-making-waves/issues/6.
    this.harmonics = [];
    for ( let order = 1; order <= this.numberOfHarmonicsProperty.range.max; order++ ) {
      this.harmonics.push( new Harmonic( {
        order: order,
        frequency: this.f1 * order,
        wavelength: this.L / order,
        colorProperty: FMWColorProfile.getHarmonicColorProperty( order ),
        amplitudeRange: this.amplitudeRange,
        tandem: options.tandem.createTandem( `harmonic${order}` )
      } ) );
    }

    // @public {DerivedProperty.<number[]>} amplitudesProperty - amplitudes for the relevant harmonics
    // This was requested for the PhET-iO API, but has proven to be generally useful.
    // dispose is not needed
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

  /**
   * Gets the amplitude at an x coordinate, where the semantics of x depends on what the domain is.
   * This algorithm uses the equation that corresponds to EquationForm.MODE.
   * @param {number} x
   * @param {Harmonic} harmonic
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} L
   * @param {number} T
   * @param {number} t
   * @returns {number}
   * @public
   */
  static getAmplitudeAt( x, harmonic, domain, seriesType, L, T, t ) {

    assert && assert( typeof x === 'number', 'invalid x' );
    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );

    const order = harmonic.order;
    const amplitude = harmonic.amplitudeProperty.value;

    let y;
    if ( domain === Domain.SPACE ) {
      if ( seriesType === SeriesType.SINE ) {
        y = amplitude * Math.sin( 2 * Math.PI * order * x / L );
      }
      else {
        y = amplitude * Math.cos( 2 * Math.PI * order * x / L );
      }
    }
    else if ( domain === Domain.TIME ) {
      if ( seriesType === SeriesType.SINE ) {
        y = amplitude * Math.sin( 2 * Math.PI * order * x / T );
      }
      else {
        y = amplitude * Math.cos( 2 * Math.PI * order * x / T );
      }
    }
    else { // Domain.SPACE_AND_TIME
      if ( seriesType === SeriesType.SINE ) {
        y = amplitude * Math.sin( 2 * Math.PI * order * ( x / L - t / T ) );
      }
      else {
        y = amplitude * Math.cos( 2 * Math.PI * order * ( x / L - t / T ) );
      }
    }
    return y;
  }
}

fourierMakingWaves.register( 'FourierSeries', FourierSeries );
export default FourierSeries;
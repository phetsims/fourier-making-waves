// Copyright 2021, University of Colorado Boulder

/**
 * WavePacket is the model of a Gaussian wave packet.
 *
 * Note that while the model uses field names that are specific to the space domain, those fields are used for both
 * the space domain and time domain. We can make this simplification (which originated in the Java version) because
 * we assume that the values of L (wavelength of the fundamental harmonic) and T (period of the fundamental harmonic)
 * are the same. That is, L=1 meter and T=1 millisecond. Changing the domain therefore only changes the symbols and
 * units that appear in the user interface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// valid values for k1 (component spacing)
const K1_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class WavePacket {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public
    this.L = 1; // wavelength, in m
    this.T = 1; // period, in ms
    this.xRange = new Range( 0, 24 * Math.PI );
    assert && assert( this.xRange.min === 0 );

    // Assumptions about L and T that were inherited from the Java version.
    assert && assert( this.L === this.T && this.L === 1 && this.T === 1,
      'Many things in this implementation assume L === T === 1' );

    // @public k1 (or sigma1), the spacing between Fourier components, in rad/m (or rad/ms).
    // dispose is not needed
    this.k1Property = new NumberProperty( K1_VALUES[ 3 ], {
      validValues: K1_VALUES,
      range: new Range( K1_VALUES[ 0 ], K1_VALUES[ K1_VALUES.length - 1 ] ),
      tandem: options.tandem.createTandem( 'k1Property' )
    } );

    // @public k0 (or omega0), the center of the wave packet, in rad/m (or rad/ms)
    this.k0Property = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'k0Property' )
    } );

    // @public dk, half the wave packet width, in rad/m (or rad/ms)
    this.dkProperty = new NumberProperty( 3 * Math.PI, {
      range: new Range( 1, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'dkProperty' )
    } );

    // @public wave packet width, in rad/m (or rad/ms)
    // dispose is not needed.
    this.widthProperty = new DerivedProperty( [ this.dkProperty ], dk => 2 * dk );
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
    this.k1Property.reset();
    this.k0Property.reset();
    this.dkProperty.reset();
  }

  /**
   * Gets the number of components in the Fourier series.
   * @returns {number}
   * @public
   */
  getNumberOfComponents() {
    const k1 = this.k1Property.value;
    if ( k1 === 0 ) {
      return Infinity;
    }
    else {
      return Math.floor( this.xRange.getLength() / k1 ) - 1;
    }
  }

  /**
   * Gets the amplitude of component k, using the standard Gaussian formula:
   *
   * A(k,k0,dk) = exp[ -((k-k0)^2) / (2 * (dk^2) )  ] / (dk * sqrt( 2pi ))
   *
   * @param {number} k - component value, in radians/m
   * @returns {number}
   * @public
   */
  getAmplitude( k ) {
    assert && assert( typeof k === 'number' );

    const k0 = this.k0Property.value;
    const dk = this.dkProperty.value;
    const kk0 = k - k0;
    return Math.exp( -( kk0 * kk0 ) / ( 2 * dk * dk ) ) / ( dk * Math.sqrt( 2 * Math.PI ) );
  }

  /**
   * Gets the data set for component amplitudes. If the number of components is infinite, returns an empty data set.
   * @returns {Vector2[]}
   * @public
   */
  getComponentAmplitudesDataSet() {

    const dataSet = []; // {Vector2}
    const numberOfComponents = this.getNumberOfComponents();
    if ( numberOfComponents !== Infinity ) {
      const k1 = this.k1Property.value;
      for ( let order = 1; order <= numberOfComponents; order++ ) {
        const kn = order * k1;
        const An = this.getAmplitude( kn ) * k1;
        dataSet.push( new Vector2( kn, An ) );
      }
    }

    return dataSet;
  }

  /**
   * Gets the data set that approximates a continuous waveform.
   * @returns {Vector2[]}
   * @public
   */
  getContinuousWaveformDataSet() {

    const dataSet = []; // {Vector2[]}
    const kStep = Math.PI / 10; // set empirically, so that the plot looks smooth
    const kMax = this.xRange.max + Math.PI;

    let k = this.xRange.min;
    while ( k <= kMax ) {
      const amplitude = this.getAmplitude( k );
      dataSet.add( new Vector2( k, amplitude ) );
      k += kStep;
    }

    return dataSet;
  }
}

fourierMakingWaves.register( 'WavePacket', WavePacket );
export default WavePacket;
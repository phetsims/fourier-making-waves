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

// valid values for component spacing
const COMPONENT_SPACING_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class WavePacket {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public
    this.L = 1; // wavelength, in m
    this.T = 1; // period, in ms
    assert && assert( this.L === this.T && this.L === 1 && this.T === 1,
      'Many things in this implementation assume that L === T === 1, inherited from Java version' );

    // @public
    this.xRange = new Range( 0, 24 * Math.PI );
    assert && assert( this.xRange.min === 0 );

    // @public the spacing between Fourier components, k1 (rad/m) or sigma1 (rad/ms)
    this.componentSpacingProperty = new NumberProperty( COMPONENT_SPACING_VALUES[ 3 ], {
      validValues: COMPONENT_SPACING_VALUES,
      range: new Range( COMPONENT_SPACING_VALUES[ 0 ], COMPONENT_SPACING_VALUES[ COMPONENT_SPACING_VALUES.length - 1 ] ),
      tandem: options.tandem.createTandem( 'componentSpacingProperty' )
    } );

    // @public the center of the wave packet, k0 (rad/m) or omega0 (rad/ms)
    this.centerProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'centerProperty' )
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
    this.componentSpacingProperty.reset();
    this.centerProperty.reset();
    this.dkProperty.reset();
  }

  /**
   * Gets the number of components in the Fourier series.
   * @returns {number}
   * @public
   */
  getNumberOfComponents() {
    const componentSpacing = this.componentSpacingProperty.value;
    if ( componentSpacing === 0 ) {
      return Infinity;
    }
    else {
      return Math.floor( this.xRange.getLength() / componentSpacing ) - 1;
    }
  }

  /**
   * Gets the amplitude of component k, using the standard Gaussian formula:
   *
   * A(k,k0,dk) = exp[ -((k-k0)^2) / (2 * (dk^2) )  ] / (dk * sqrt( 2pi ))
   *
   * Note that symbols (k, rad/m) used in this method are specific to the space domain. But this method can also be used
   * for the time domain (sigma, rad/ms), because L === T === 1.
   *
   * @param {number} k - component value, in rad/m
   * @returns {number}
   * @public
   */
  getAmplitude( k ) {
    assert && assert( typeof k === 'number' );
    assert && assert( this.L === 1 && this.T === 1 );

    const k0 = this.centerProperty.value;
    const dk = this.dkProperty.value;
    const kk0 = k - k0;
    return Math.exp( -( kk0 * kk0 ) / ( 2 * dk * dk ) ) / ( dk * Math.sqrt( 2 * Math.PI ) );
  }

  /**
   * Gets the data set for Fourier component amplitudes. Note that the position of the Fourier components is fixed.
   * If the wave packet's center is not located at the position of one of the components, then the approximation
   * (and the amplitudes) will be asymmetric.
   * @returns {Vector2[]} - empty if the number of components is infinite
   * @public
   */
  getComponentAmplitudesDataSet() {

    const dataSet = []; // {Vector2}
    const numberOfComponents = this.getNumberOfComponents();
    if ( numberOfComponents !== Infinity ) {
      const componentSpacing = this.componentSpacingProperty.value;
      for ( let order = 1; order <= numberOfComponents; order++ ) {
        const kn = order * componentSpacing;
        const An = this.getAmplitude( kn ) * componentSpacing;
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
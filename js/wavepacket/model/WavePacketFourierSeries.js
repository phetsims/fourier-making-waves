// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketFourierSeries is the Fouriers series in the 'Wave Packet' screen. It's used to approximate a wave packet,
 * and is significantly different than the model used in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

// valid values for component spacing
const COMPONENT_SPACING_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class WavePacketFourierSeries {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.xRange = new Range( 0, 24 * Math.PI );
    assert && assert( this.xRange.min === 0 );

    // @public the spacing between Fourier components, k1 (rad/m) or omega (rad/ms)
    this.componentSpacingProperty = new NumberProperty( COMPONENT_SPACING_VALUES[ 3 ], {
      validValues: COMPONENT_SPACING_VALUES,
      range: new Range( COMPONENT_SPACING_VALUES[ 0 ], COMPONENT_SPACING_VALUES[ COMPONENT_SPACING_VALUES.length - 1 ] ),
      tandem: options.tandem.createTandem( 'componentSpacingProperty' ),
      phetioDocumentation: 'The spacing of components in the Fourier series that is used to approximate the wave packet. ' +
                           'In the space domain, this is k<sub>1</sub>, in rad/m. ' +
                           'In the time domain, this is \u03c9<sub>1</sub>, in rad/ms.'
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
    this.componentSpacingProperty.reset();
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
   * Gets the amplitude of Fourier component k, using the standard Gaussian formula:
   *
   * A(k,k0,dk) = exp[ -((k-k0)^2) / (2 * (dk^2) )  ] / (dk * sqrt( 2pi ))
   *
   * Note that symbols (k, rad/m) used in this method are specific to the space domain. But this method can also be used
   * for the time domain (omega, rad/ms), because L === T === 1.
   *
   * @param {number} k - component value, in rad/m
   * @param {WavePacket} wavePacket
   * @returns {number}
   * @public
   */
  getComponentAmplitude( k, wavePacket ) {
    assert && assert( typeof k === 'number' );
    assert && assert( wavePacket instanceof WavePacket );
    assert && assert( wavePacket.L === 1 && wavePacket.T === 1 );

    const k0 = wavePacket.centerProperty.value;
    const dk = wavePacket.standardDeviationProperty.value;
    return Math.exp( -( ( k - k0 ) * ( k - k0 ) ) / ( 2 * dk * dk ) ) / ( dk * Math.sqrt( 2 * Math.PI ) );
  }

  /**
   * Gets the data set for Fourier component amplitudes. Note that the position of the Fourier components is fixed.
   * If the wave packet's center is not located at the position of one of the components, then the approximation
   * (and the amplitudes) will be asymmetric.
   * @param {WavePacket} wavePacket
   * @returns {Vector2[]} - empty if the number of components is infinite
   * @public
   */
  getComponentAmplitudesDataSet( wavePacket ) {
    assert && assert( wavePacket instanceof WavePacket );

    const dataSet = []; // {Vector2}
    const numberOfComponents = this.getNumberOfComponents();
    if ( numberOfComponents !== Infinity ) {
      const componentSpacing = this.componentSpacingProperty.value;
      for ( let order = 1; order <= numberOfComponents; order++ ) {
        const kn = order * componentSpacing;
        const An = this.getComponentAmplitude( kn, wavePacket ) * componentSpacing;
        dataSet.push( new Vector2( kn, An ) );
      }
    }

    return dataSet;
  }

  /**
   * Gets the data set that approximates a continuous waveform.
   * @param {WavePacket} wavePacket
   * @returns {Vector2[]}
   * @public
   */
  getContinuousWaveformDataSet( wavePacket ) {
    assert && assert( wavePacket instanceof WavePacket );

    const dataSet = []; // {Vector2[]}
    const kStep = Math.PI / 10; // ENVELOPE_STEP in D2CAmplitudesView.java, chosen so that the plot looks smooth
    const kMax = this.xRange.max + Math.PI;
    const k1 = this.componentSpacingProperty.value;

    let k = this.xRange.min;
    while ( k <= kMax ) {
      let amplitude = this.getComponentAmplitude( k, wavePacket );
      if ( k1 !== 0 ) {
        amplitude *= k1;
      }
      dataSet.push( new Vector2( k, amplitude ) );
      k += kStep;
    }

    return dataSet;
  }
}

fourierMakingWaves.register( 'WavePacketFourierSeries', WavePacketFourierSeries );
export default WavePacketFourierSeries;
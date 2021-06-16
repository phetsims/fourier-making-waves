// Copyright 2021, University of Colorado Boulder

/**
 * WavePacket is the model of a Gaussian wave packet.
 *
 * Note that while the model uses field names that are specific to the space domain, those fields are used for both
 * the space domain and time domain. We can make this simplification (which originated in the Java version) because
 * we assume that the values of L (wavelength of the fundamental harmonic) and T (period of the fundamental harmonic)
 * are the same. That is, L=1 meter and T=1 millisecond. Changing the domain therefore only changes the symbols and
 * units that appear in the user interface. Where the space domain uses meters, the time domain uses milliseconds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// valid values for componentSpacingProperty
const COMPONENT_SPACING_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class WavePacket {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public
    this.L = 1; // wavelength, in meters
    this.T = 1; // period, in milliseconds

    // Assumptions about L and T that were inherited from the Java version.
    assert && assert( this.L === this.T && this.L === 1 && this.T === 1,
      'Many things in this implementation assume L === T === 1' );

    // @public index into COMPONENT_SPACING_VALUES, so that we have a linear value to control via Slider
    this.componentSpacingIndexProperty = new NumberProperty( 3, {
      numberType: 'Integer',
      range: new Range( 0, COMPONENT_SPACING_VALUES.length - 1 ),
      tandem: options.tandem.createTandem( 'componentSpacingIndexProperty' )
    } );

    // @public {DerivedProperty.<number>} spacing between Fourier components, in radians/meter.
    // dispose is not needed
    this.componentSpacingProperty = new DerivedProperty(
      [ this.componentSpacingIndexProperty ],
      index => COMPONENT_SPACING_VALUES[ index ], {
        validValues: COMPONENT_SPACING_VALUES,
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        tandem: options.tandem.createTandem( 'componentSpacingProperty' )
      } );

    // @public k0, the center of the wave packet, in radians/meter
    this.k0Property = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'k0Property' )
    } );

    // @public dk is half the wave packet width in k space, in radians/meter.
    this.dkProperty = new NumberProperty( 3 * Math.PI, {
      reentrant: true, //TODO
      range: new Range( 1, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'dkProperty' )
    } );

    // @public dk * dx = 1, so dx = 1 / dk
    this.dxProperty = new NumberProperty( 1 / this.dkProperty.value, {
      reentrant: true, //TODO
      range: new Range( 1 / this.dkProperty.range.max, 1 / this.dkProperty.range.min ),
      tandem: options.tandem.createTandem( 'dxProperty' )
    } );

    //TODO need a better solution here.
    // Keep dk and dx synchronized.
    this.dkProperty.lazyLink( dk => {
      this.dxProperty.value = 1 / dk;
    } );
    this.dxProperty.lazyLink( dx => {
      this.dkProperty.value = 1 / dx;
    } );

    // @public wave packet width, in radians/meter
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
    this.componentSpacingIndexProperty.reset();
    this.k0Property.reset();
    this.dkProperty.reset();
    this.dxProperty.reset();
  }

  /**
   * Gets the amplitude of some component, using the standard Gaussian formula:
   *
   * A(k,k0,dk) = exp[ -((k-k0)^2) / (2 * (dk^2) )  ] / (dk * sqrt( 2pi ))
   *
   * @param {number} k - component value, in radians/mm
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
}

fourierMakingWaves.register( 'WavePacket', WavePacket );
export default WavePacket;
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
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

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
    this.centerProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'centerProperty' ),
      phetioDocumentation: 'The center of the wave packet. ' +
                           'In the space domain this is k<sub>0</sub>, in rad/m. ' +
                           'In the time domain, this is \u03c9<sub>0</sub>, in rad/ms.'
    } );

    // @public
    this.dkProperty = new NumberProperty( 3 * Math.PI, {
      range: new Range( 1, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'dkProperty' ),
      phetioDocumentation: 'The standard deviation of the wave packet width. ' +
                           'In the space domain this is k<sub>1</sub>, in rad/m. ' +
                           'In the time domain, this is \u03c9<sub>1</sub>, in rad/ms.'
    } );

    // @public
    this.widthProperty = new DerivedProperty( [ this.dkProperty ], dk => 2 * dk, {
      tandem: options.tandem.createTandem( 'widthProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
      phetioDocumentation: 'The width of the wave packet. ' +
                           'In the space domain this is in rad/m. ' +
                           'In the time domain, this is in rad/ms.'
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
    this.centerProperty.reset();
    this.dkProperty.reset();
  }
}

fourierMakingWaves.register( 'WavePacket', WavePacket );
export default WavePacket;
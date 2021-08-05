// Copyright 2021, University of Colorado Boulder

/**
 * FourierComponent is the model of a Fourier component for the Wave Packet screen.
 * In the Discrete and Wave Game screens, we used Harmonic, a much richer implementation.
 * That implementation is overly-complicated for the Wave Packet screen, and we need something more
 * lightweight due to the large number of components.
 *
 * A Fourier component was originally modeled as a Vector2, but this abstraction is better.
 * For PhET-iO, the implementation of FourierComponentIO is borrowed from Vector2IO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FourierComponent {

  /**
   * @param {number} waveNumber
   * @param {number} amplitude
   */
  constructor( waveNumber, amplitude ) {
    assert && AssertUtils.assertNonNegativeNumber( waveNumber );
    assert && AssertUtils.assertNonNegativeNumber( amplitude );

    // @public (read-only)
    this.waveNumber = waveNumber;
    this.amplitude = amplitude;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by FourierComponent to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Constructs a FourierComponent from a duck-typed object, for use with tandem/phet-io deserialization.
   * @param {{waveNumber:number, amplitude:number}} stateObject
   * @returns {FourierComponent}
   * @public
   * @static
   */
  static fromStateObject( stateObject ) {
    return new FourierComponent( stateObject.waveNumber, stateObject.amplitude );
  }

  /**
   * Returns a duck-typed object meant for use with tandem/phet-io serialization.
   * @returns {{waveNumber:number, amplitude:number}}
   * @public
   */
  toStateObject() {
    return {
      waveNumber: this.waveNumber,
      amplitude: this.amplitude
    };
  }
}

FourierComponent.FourierComponentIO = IOType.fromCoreType( 'FourierComponentIO', FourierComponent, {
  documentation: 'Component of Fourier series',
  stateSchema: {
    waveNumber: NumberIO,
    amplitude: NumberIO
  }
} );

fourierMakingWaves.register( 'FourierComponent', FourierComponent );
export default FourierComponent;
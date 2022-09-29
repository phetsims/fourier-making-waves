// Copyright 2021, University of Colorado Boulder

/**
 * FourierComponent is the model of a Fourier component for the Wave Packet screen.
 * In the Discrete and Wave Game screens, we used Harmonic, a much richer implementation.
 * That implementation is overly-complicated for the Wave Packet screen, and we need something more
 * lightweight due to the large number of components.
 *
 * A Fourier component was originally modeled as a Vector2. But FourierComponent is more aligned with MVC pattern -
 * we can refer to waveNumber and amplitude (model properties), instead of Vector2's x and y (view properties).
 * This improves the code and the PhET-iO API.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FourierComponent {

  /**
   * @param {number} waveNumber - k is spatial wave number in rad/m, omega is angular wave number in rad/ms
   * @param {number} amplitude - unitless
   */
  constructor( waveNumber, amplitude ) {
    assert && AssertUtils.assertNonNegativeNumber( waveNumber );
    assert && AssertUtils.assertNonNegativeNumber( amplitude );

    // @public (read-only)
    this.waveNumber = waveNumber;
    this.amplitude = amplitude;
  }
}

// FourierComponentIO is adapted from Vector2.Vector2IO.
FourierComponent.FourierComponentIO = new IOType( 'FourierComponentIO', {
  valueType: FourierComponent,
  documentation: 'Component of a Fourier series',
  stateSchema: {
    waveNumber: NumberIO,
    amplitude: NumberIO
  },
  toStateObject: fourierComponent => {
    return {
      waveNumber: fourierComponent.waveNumber,
      amplitude: fourierComponent.amplitude
    };
  },
  fromStateObject: stateObject => new FourierComponent( stateObject.waveNumber, stateObject.amplitude )
} );

fourierMakingWaves.register( 'FourierComponent', FourierComponent );
export default FourierComponent;
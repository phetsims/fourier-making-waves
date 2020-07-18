// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteModel is the model for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';
import PresetFunction from './PresetFunction.js';
import WaveType from './WaveType.js';

class DiscreteModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public
    this.presetFunctionProperty = new EnumerationProperty( PresetFunction, PresetFunction.SINE_COSINE );

    // @public
    this.numberOfHarmonicsProperty = new NumberProperty( 1, {
      range: new Range( 1, FourierMakingWavesConstants.MAX_HARMONICS )
    } );

    // @public
    this.waveTypeProperty = new EnumerationProperty( WaveType, WaveType.SINE );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.presetFunctionProperty.reset();
    this.numberOfHarmonicsProperty.reset();
    this.waveTypeProperty.reset();
    this.domainProperty.reset();
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

fourierMakingWaves.register( 'DiscreteModel', DiscreteModel );
export default DiscreteModel;
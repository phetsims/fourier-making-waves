// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteModel is the model for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';
import MathForm from './MathForm.js';
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

    // @public
    this.wavelengthToolEnabledProperty = new BooleanProperty( false );

    // @public
    this.selectedWavelengthProperty = new NumberProperty( 1, {
      range: new Range( 1, this.numberOfHarmonicsProperty.value )
    } );

    // @public
    this.periodToolEnabledProperty = new BooleanProperty( false );

    // @public
    this.selectedPeriodProperty = new NumberProperty( 1, {
      range: new Range( 1, this.numberOfHarmonicsProperty.value )
    } );

    // @public
    this.mathFormProperty = new EnumerationProperty( MathForm, MathForm.HIDDEN );

    // @public TODO move to view?
    this.sumExpandedProperty = new BooleanProperty( false );

    // Adjust the range of selectable wavelength and period based on how many harmonics we have.
    this.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      this.selectedWavelengthProperty.value = Math.min( numberOfHarmonics, this.selectedWavelengthProperty.value );
      this.selectedWavelengthProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
      this.selectedPeriodProperty.value = Math.min( numberOfHarmonics, this.selectedPeriodProperty.value );
      this.selectedPeriodProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
    } );
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
    this.wavelengthToolEnabledProperty.reset();
    this.selectedWavelengthProperty.reset();
    this.periodToolEnabledProperty.reset();
    this.selectedPeriodProperty.reset();
    this.mathFormProperty.reset();
    this.sumExpandedProperty.reset();
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
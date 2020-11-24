// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteModel is the model for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import animationFrameTimer from '../../../../axon/js/animationFrameTimer.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierSeries from '../../common/model/FourierSeries.js';
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
    this.fourierSeries = new FourierSeries( {
      tandem: tandem.createTandem( 'fourierSeries' )
    } );

    // @public
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public
    this.presetFunctionProperty = new EnumerationProperty( PresetFunction, PresetFunction.SINE_COSINE );

    // @public
    this.waveTypeProperty = new EnumerationProperty( WaveType, WaveType.SINE );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE );

    // @public
    this.wavelengthToolEnabledProperty = new BooleanProperty( false );

    // @public
    this.selectedWavelengthProperty = new NumberProperty( 1, {
      range: new Range( 1, this.fourierSeries.numberOfHarmonicsProperty.value )
    } );

    // @public
    this.periodToolEnabledProperty = new BooleanProperty( false );

    // @public
    this.selectedPeriodProperty = new NumberProperty( 1, {
      range: new Range( 1, this.fourierSeries.numberOfHarmonicsProperty.value )
    } );

    // @public
    this.mathFormProperty = new EnumerationProperty( MathForm, MathForm.HIDDEN );

    // @public TODO move to view?
    this.sumExpandedProperty = new BooleanProperty( false );

    // Adjust the range of selectable wavelength and period based on how many harmonics we have.
    this.fourierSeries.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      this.selectedWavelengthProperty.value = Math.min( numberOfHarmonics, this.selectedWavelengthProperty.value );
      this.selectedWavelengthProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
      this.selectedPeriodProperty.value = Math.min( numberOfHarmonics, this.selectedPeriodProperty.value );
      this.selectedPeriodProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
    } );

    // @public emits if you try to make a sawtooth wave with cosines
    this.oopsSawtoothWithCosinesEmitter = new Emitter();

    // Set amplitudes for preset functions. umultilink is not needed.
    Property.multilink(
      [ this.fourierSeries.numberOfHarmonicsProperty, this.presetFunctionProperty, this.waveTypeProperty ],
      ( numberOfHarmonics, presetFunction, waveType ) => {

        if ( presetFunction === PresetFunction.SAWTOOTH && waveType === WaveType.COSINE ) {

          phet.log && phet.log( 'not possible to make a sawtooth out of cosines, switching to sine' );
          this.oopsSawtoothWithCosinesEmitter.emit();

          // Switch to sine on the next tick, so that we don't have a reentry problem with waveTypeProperty.
          animationFrameTimer.runOnNextTick( () => {
            this.waveTypeProperty.value = WaveType.SINE;
          } );
        }
        else if ( presetFunction !== PresetFunction.CUSTOM ) {
          const amplitudes = presetFunction.getAmplitudes( numberOfHarmonics, waveType );
          assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
          for ( let i = 0; i < numberOfHarmonics; i++ ) {
            this.fourierSeries.harmonics[ i ].amplitudeProperty.value = amplitudes[ i ];
          }
        }
      } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.fourierSeries.reset();
    this.isPlayingProperty.reset();
    this.presetFunctionProperty.reset();
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
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
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
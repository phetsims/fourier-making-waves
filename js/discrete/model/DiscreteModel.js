// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteModel is the top-level model for the 'Discrete' screen.
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
import FMWUtils from '../../common/FMWUtils.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteChartsModel from './DiscreteChartsModel.js';
import Domain from './Domain.js';
import MathForm from './MathForm.js';
import Waveform from './Waveform.js';
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

    // @public time (t) in seconds
    this.tProperty = new NumberProperty( 0 );

    // @public
    this.waveformProperty = new EnumerationProperty( Waveform, Waveform.SINE_COSINE );

    // @public
    this.waveTypeProperty = new EnumerationProperty( WaveType, WaveType.SINE );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE );

    // @public
    this.mathFormProperty = new EnumerationProperty( MathForm, MathForm.HIDDEN );

    // @public whether the sound of the Fourier series is enabled
    this.soundEnabledProperty = new BooleanProperty( false );

    // @public volume of the sound for the Fourier series
    this.soundOutputLevelProperty = new NumberProperty( 0.25, {
      range: new Range( 0, 1 )
    } );

    // @public whether the Wavelength tool is selected
    this.wavelengthToolSelectedProperty = new BooleanProperty( false );

    // @public whether the Period tool is selected
    this.periodToolSelectedProperty = new BooleanProperty( false );

    // @public order of the harmonic measured by the Wavelength tool
    this.wavelengthToolOrderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, this.fourierSeries.numberOfHarmonicsProperty.value )
    } );

    // @public order of the harmonic measured by the Period tool
    this.periodToolOrderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, this.fourierSeries.numberOfHarmonicsProperty.value )
    } );

    // @public
    this.chartsModel = new DiscreteChartsModel();

    // @public emits if you try to make a sawtooth wave with cosines
    this.oopsSawtoothWithCosinesEmitter = new Emitter();

    // Set amplitudes for pre-defined waveforms
    const updateAmplitudes = ( numberOfHarmonics, waveform, waveType ) => {

      if ( waveform === Waveform.SAWTOOTH && waveType === WaveType.COSINE ) {

        phet.log && phet.log( 'not possible to make a sawtooth out of cosines, switching to sine' );
        this.oopsSawtoothWithCosinesEmitter.emit();

        // Switch to sine on the next tick, so that we don't have a reentry problem with waveTypeProperty.
        animationFrameTimer.runOnNextTick( () => {
          this.waveTypeProperty.value = WaveType.SINE;
        } );
      }
      else if ( waveform !== Waveform.CUSTOM ) {
        const amplitudes = waveform.getAmplitudes( numberOfHarmonics, waveType );
        assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
        for ( let i = 0; i < numberOfHarmonics; i++ ) {
          this.fourierSeries.harmonics[ i ].amplitudeProperty.value = amplitudes[ i ];
        }
      }
    };

    // umultilink is not needed.
    Property.multilink(
      [ this.fourierSeries.numberOfHarmonicsProperty, this.waveformProperty, this.waveTypeProperty ],
      ( numberOfHarmonics, waveform, waveType ) => updateAmplitudes( numberOfHarmonics, waveform, waveType )
    );

    //TODO are there other things that should reset t ?
    // Changing these things resets time (t).
    Property.multilink(
      [ this.waveformProperty, this.domainProperty ],
      () => this.tProperty.reset()
    );

    // Ensure that the math form is appropriate for the domain. MathForm.MODE is supported for all Domain values.
    this.domainProperty.link( () => {
      if ( this.mathFormProperty.value !== MathForm.MODE ) {
        this.mathFormProperty.value = MathForm.HIDDEN;
      }
    } );

    // Adjust measurement tools when a harmonic becomes irrelevant.
    // unlink is not needed.
    this.fourierSeries.numberOfHarmonicsProperty.link( numberOfHarmonics => {

      // If a measurement tool is selected and its harmonic is no longer relevant, unselect the tool.
      if ( this.wavelengthToolSelectedProperty.value ) {
        this.wavelengthToolSelectedProperty.value = ( this.wavelengthToolOrderProperty.value <= numberOfHarmonics );
      }
      if ( this.periodToolSelectedProperty.value ) {
        this.periodToolSelectedProperty.value = ( this.periodToolOrderProperty.value <= numberOfHarmonics );
      }

      // If a measurement tool is associated with a harmonic that is no longer relevant, associate the tool with
      // the highest-order harmonic.
      this.wavelengthToolOrderProperty.value = Math.min( numberOfHarmonics, this.wavelengthToolOrderProperty.value );
      this.wavelengthToolOrderProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
      this.periodToolOrderProperty.value = Math.min( numberOfHarmonics, this.periodToolOrderProperty.value );
      this.periodToolOrderProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
    } );

    // @private
    this.resetDiscreteModel = () => {

      // Reset the fourier series
      this.fourierSeries.reset();

      // Reset the charts
      this.chartsModel.reset();

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );

      // Set the amplitudes of the Fourier series to match Property settings.
      updateAmplitudes( this.fourierSeries.numberOfHarmonicsProperty.value, this.waveformProperty.value, this.waveTypeProperty.value );
    };
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.resetDiscreteModel();
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
    if ( this.isPlayingProperty.value && ( this.domainProperty.value === Domain.SPACE_AND_TIME ) ) {
      this.tProperty.value += dt;
    }
  }
}

fourierMakingWaves.register( 'DiscreteModel', DiscreteModel );
export default DiscreteModel;
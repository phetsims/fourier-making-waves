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
import HarmonicsChart from './HarmonicsChart.js';
import Domain from './Domain.js';
import EquationForm from './EquationForm.js';
import MeasurementTool from './MeasurementTool.js';
import SumChart from './SumChart.js';
import Waveform from './Waveform.js';
import SeriesType from './SeriesType.js';

// This factor slows down time for the 'space & time' domain, determined empirically.
const TIME_SCALE = 0.001;

// How much to step the simulation when the Step button is pressed, in milliseconds, determined empirically.
const STEP_DT = 50;

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

    // @public time (t), updated only when domainProperty is Domain.SPACE_AND_TIME
    // While the units are in milliseconds, the value is scaled so that it's practical to show high-frequency
    // phenomena in the sim, specifically in the 'space & time' domain.
    this.tProperty = new NumberProperty( 0, {
      phetioDocumentation: 'time in millisecond, relevant only for function of space & time',
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'tProperty' )
    } );

    // @public
    this.waveformProperty = new EnumerationProperty( Waveform, Waveform.SINUSOID, {
      tandem: tandem.createTandem( 'waveformProperty' )
    } );

    // @public
    this.seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE, {
      tandem: tandem.createTandem( 'seriesTypeProperty' )
    } );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      tandem: tandem.createTandem( 'domainProperty' )
    } );

    // @public
    this.equationFormProperty = new EnumerationProperty( EquationForm, EquationForm.HIDDEN, {
      tandem: tandem.createTandem( 'equationFormProperty' )
    } );

    const soundTandem = tandem.createTandem( 'sound' );

    // @public whether sound is enabled for the Fourier series
    this.fourierSeriesSoundEnabledProperty = new BooleanProperty( false, {
      tandem: soundTandem.createTandem( 'fourierSeriesSoundEnabledProperty' )
    } );

    // @public volume of the sound for the Fourier series
    this.fourierSeriesSoundOutputLevelProperty = new NumberProperty( 0.25, {
      range: new Range( 0, 1 ),
      tandem: soundTandem.createTandem( 'fourierSeriesSoundOutputLevelProperty' )
    } );

    const measurementToolsTandem = tandem.createTandem( 'measurementTools' );

    // @public the wavelength measurement tool
    this.wavelengthTool = new MeasurementTool( this.fourierSeries.numberOfHarmonicsProperty, {
      tandem: measurementToolsTandem.createTandem( 'wavelengthTool' )
    } );

    // @public the period measurement tool
    this.periodTool = new MeasurementTool( this.fourierSeries.numberOfHarmonicsProperty, {
      tandem: measurementToolsTandem.createTandem( 'periodTool' )
    } );

    // @public
    this.harmonicsChart = new HarmonicsChart( this.fourierSeries, this.domainProperty,
      this.seriesTypeProperty, this.tProperty );

    // @public
    this.sumChart = new SumChart( this.fourierSeries, this.domainProperty, this.seriesTypeProperty,
      this.tProperty, this.harmonicsChart.xZoomLevelProperty, this.harmonicsChart.xAxisDescriptionProperty );

    // @public emits if you try to make a sawtooth wave with cosines
    this.oopsSawtoothWithCosinesEmitter = new Emitter();

    // Set amplitudes for pre-defined waveforms
    const updateAmplitudes = ( numberOfHarmonics, waveform, seriesType ) => {

      if ( waveform === Waveform.SAWTOOTH && seriesType === SeriesType.COSINE ) {

        phet.log && phet.log( 'not possible to make a sawtooth out of cosines, switching to sine' );
        this.oopsSawtoothWithCosinesEmitter.emit();

        // Switch to sine on the next tick, so that we don't have a reentry problem with seriesTypeProperty.
        animationFrameTimer.runOnNextTick( () => {
          this.seriesTypeProperty.value = SeriesType.SINE;
        } );
      }
      else if ( waveform !== Waveform.CUSTOM ) {
        const amplitudes = waveform.getAmplitudes( numberOfHarmonics, seriesType );
        assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
        for ( let i = 0; i < numberOfHarmonics; i++ ) {
          this.fourierSeries.harmonics[ i ].amplitudeProperty.value = amplitudes[ i ];
        }
      }
    };

    // umultilink is not needed.
    Property.multilink(
      [ this.fourierSeries.numberOfHarmonicsProperty, this.waveformProperty, this.seriesTypeProperty ],
      ( numberOfHarmonics, waveform, seriesType ) => updateAmplitudes( numberOfHarmonics, waveform, seriesType )
    );

    //TODO are there other things that should reset t ?
    // Changing these things resets time (t).
    Property.multilink(
      [ this.waveformProperty, this.domainProperty ],
      () => this.tProperty.reset()
    );

    // Ensure that the math form is appropriate for the domain. EquationForm.MODE is supported for all Domain values.
    this.domainProperty.link( () => {
      if ( this.equationFormProperty.value !== EquationForm.MODE ) {
        this.equationFormProperty.value = EquationForm.HIDDEN;
      }
    } );

    // @private
    this.resetDiscreteModel = () => {

      // Reset subcomponents
      this.fourierSeries.reset();
      this.harmonicsChart.reset();
      this.sumChart.reset();
      this.wavelengthTool.reset();
      this.periodTool.reset();

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );

      // Set the amplitudes of the Fourier series to match Property settings.
      updateAmplitudes( this.fourierSeries.numberOfHarmonicsProperty.value, this.waveformProperty.value, this.seriesTypeProperty.value );
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
      const milliseconds = dt * 1000;
      this.tProperty.value += ( milliseconds * TIME_SCALE );
    }
  }

  /**
   * Steps the model once step. This is called when the Step button is pressed.
   * @public
   */
  stepOnce() {
    this.tProperty.value += ( STEP_DT * TIME_SCALE );
  }
}

fourierMakingWaves.register( 'DiscreteModel', DiscreteModel );
export default DiscreteModel;
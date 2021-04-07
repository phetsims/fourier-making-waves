// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteModel is the top-level model for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import animationFrameTimer from '../../../../axon/js/animationFrameTimer.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteFourierSeries from './DiscreteFourierSeries.js';
import Domain from '../../common/model/Domain.js';
import EquationForm from './EquationForm.js';
import HarmonicsChart from './HarmonicsChart.js';
import MeasurementTool from './MeasurementTool.js';
import SeriesType from '../../common/model/SeriesType.js';
import SumChart from './SumChart.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import Waveform from './Waveform.js';

// This factor slows down time for the 'space & time' domain, determined empirically.
const TIME_SCALE = 0.001;

// How much to step the simulation when the Step button is pressed, in milliseconds, determined empirically.
const STEP_DT = 50;

class DiscreteModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.fourierSeries = new DiscreteFourierSeries( {
      tandem: options.tandem.createTandem( 'fourierSeries' )
    } );

    // @public
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public time (t), updated only when domainProperty is Domain.SPACE_AND_TIME
    // While the units are in milliseconds, the value is scaled so that it's practical to show high-frequency
    // phenomena in the sim, specifically in the 'space & time' domain.
    this.tProperty = new NumberProperty( 0, {
      phetioDocumentation: 'time in millisecond, relevant only for function of space & time',
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'tProperty' )
    } );

    // @public
    this.waveformProperty = new EnumerationProperty( Waveform, Waveform.SINUSOID, {
      tandem: options.tandem.createTandem( 'waveformProperty' )
    } );

    // @public
    this.seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE, {
      tandem: options.tandem.createTandem( 'seriesTypeProperty' )
    } );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      tandem: options.tandem.createTandem( 'domainProperty' )
    } );

    // @public
    this.equationFormProperty = new EnumerationProperty( EquationForm, EquationForm.HIDDEN, {
      tandem: options.tandem.createTandem( 'equationFormProperty' )
    } );

    // @public
    this.xAxisTickLabelFormatProperty = new DerivedProperty(
      [ this.equationFormProperty ],
      equationForm => ( equationForm === EquationForm.HIDDEN ) ? TickLabelFormat.NUMERIC : TickLabelFormat.SYMBOLIC
    );

    const soundTandem = options.tandem.createTandem( 'sound' );

    // @public whether sound is enabled for the Fourier series
    this.fourierSeriesSoundEnabledProperty = new BooleanProperty( false, {
      tandem: soundTandem.createTandem( 'fourierSeriesSoundEnabledProperty' )
    } );

    // @public volume of the sound for the Fourier series
    this.fourierSeriesSoundOutputLevelProperty = new NumberProperty( 0.25, {
      range: new Range( 0, 1 ),
      tandem: soundTandem.createTandem( 'fourierSeriesSoundOutputLevelProperty' )
    } );

    const measurementToolsTandem = options.tandem.createTandem( 'measurementTools' );

    // @public the wavelength measurement tool
    this.wavelengthTool = new MeasurementTool( FMWSymbols.lambda, this.fourierSeries.numberOfHarmonicsProperty, {
      tandem: measurementToolsTandem.createTandem( 'wavelengthTool' )
    } );

    // @public the period measurement tool
    this.periodTool = new MeasurementTool( FMWSymbols.T, this.fourierSeries.numberOfHarmonicsProperty, {
      tandem: measurementToolsTandem.createTandem( 'periodTool' )
    } );

    // @public
    this.harmonicsChart = new HarmonicsChart( this.fourierSeries, this.domainProperty,
      this.seriesTypeProperty, this.tProperty, {
        tandem: options.tandem.createTandem( 'harmonicsChart' )
      } );

    // @public
    this.sumChart = new SumChart( this.fourierSeries, this.domainProperty, this.seriesTypeProperty,
      this.tProperty, this.harmonicsChart.xZoomLevelProperty, this.harmonicsChart.xAxisDescriptionProperty, {
        tandem: options.tandem.createTandem( 'sumChart' )
      } );

    // @public emits if you try to make a sawtooth wave with cosines
    this.oopsSawtoothWithCosinesEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'oopsSawtoothWithCosinesEmitter' )
    } );

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
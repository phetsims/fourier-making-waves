// Copyright 2020-2021, University of Colorado Boulder

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
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import AmplitudesChart from '../../common/model/AmplitudesChart.js';
import Domain from '../../common/model/Domain.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import SeriesType from '../../common/model/SeriesType.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteFourierSeries from './DiscreteFourierSeries.js';
import DiscreteHarmonicsChart from './DiscreteHarmonicsChart.js';
import DiscreteSumChart from './DiscreteSumChart.js';
import DiscreteXAxisDescriptions from './DiscreteXAxisDescriptions.js';
import DiscreteYAxisDescriptions from './DiscreteYAxisDescriptions.js';
import EquationForm from './EquationForm.js';
import MeasurementTool from './MeasurementTool.js';
import Waveform from './Waveform.js';

// This factor slows down time for the 'space & time' domain, determined empirically.
const TIME_SCALE = 0.001;

// How much to step the simulation when the Step button is pressed, in milliseconds, determined empirically.
const STEP_DT = 50;

// {AxisDescription} default description for the x axis
const DEFAULT_X_AXIS_DESCRIPTION = DiscreteXAxisDescriptions[ DiscreteXAxisDescriptions.length - 2 ];
assert && assert( DEFAULT_X_AXIS_DESCRIPTION.range.getLength() === 1,
  'Expected DEFAULT_X_AXIS_DESCRIPTION range to be 1 wavelength. Did you change DiscreteXAxisDescriptions?' );

// {AxisDescription} default description for the y axis
const DEFAULT_Y_AXIS_DESCRIPTION = DiscreteYAxisDescriptions[ DiscreteYAxisDescriptions.length - 1 ];
assert && assert( DEFAULT_Y_AXIS_DESCRIPTION.range.max === FMWConstants.MAX_AMPLITUDE,
  'Expected DEFAULT_Y_AXIS_DESCRIPTION range to match maximum amplitude. Did you change DiscreteYAxisDescriptions?' );

class DiscreteModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    } );

    // Group elements related to sound under this tandem.
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
      validValues: Domain.VALUES, // all Domain values are supported
      tandem: options.tandem.createTandem( 'domainProperty' )
    } );

    // @public
    this.equationFormProperty = new EnumerationProperty( EquationForm, EquationForm.HIDDEN, {
      tandem: options.tandem.createTandem( 'equationFormProperty' )
    } );

    // @public
    this.fourierSeries = new DiscreteFourierSeries( {
      tandem: options.tandem.createTandem( 'fourierSeries' )
    } );

    // the harmonics to be emphasized in the Harmonics chart, as the result of UI interactions
    const emphasizedHarmonics = new EmphasizedHarmonics( {
      tandem: options.tandem.createTandem( 'emphasizedHarmonics' )
    } );

    // Group elements related to measurement tools under this tandem.
    const measurementToolsTandem = options.tandem.createTandem( 'measurementTools' );

    // @public the wavelength measurement tool
    this.wavelengthTool = new MeasurementTool( FMWSymbols.lambda, this.fourierSeries.numberOfHarmonicsProperty, {
      tandem: measurementToolsTandem.createTandem( 'wavelengthTool' )
    } );

    // @public the period measurement tool
    this.periodTool = new MeasurementTool( FMWSymbols.T, this.fourierSeries.numberOfHarmonicsProperty, {
      tandem: measurementToolsTandem.createTandem( 'periodTool' )
    } );

    // Determines the format of the x-axis tick labels, shared by the Harmonics and Sum charts.
    const xAxisTickLabelFormatProperty = new DerivedProperty(
      [ this.equationFormProperty ],
      equationForm => ( equationForm === EquationForm.HIDDEN ) ? TickLabelFormat.NUMERIC : TickLabelFormat.SYMBOLIC
    );

    // Guard again accidentally changing the default if DiscreteXAxisDescriptions is modified.
    assert && assert( DEFAULT_X_AXIS_DESCRIPTION.range.max === 1 / 2,
      'DEFAULT_X_ZOOM_LEVEL is probably incorrect - did you modify DiscreteXAxisDescriptions?' );

    // {Property.<XAxisDescription>} the x-axis description is shared by the Harmonics and Sum charts.
    // dispose is not needed.
    const xAxisDescriptionProperty = new Property( DEFAULT_X_AXIS_DESCRIPTION, {
      validValues: DiscreteXAxisDescriptions
    } );

    // @public
    this.amplitudesChart = new AmplitudesChart( this.fourierSeries, emphasizedHarmonics );

    // {Property.<AxisDescription>} y-axis description is specific to the Harmonics chart, not shared with the Sum chart.
    // The Harmonics chart has no zoom buttons, so it only has one y-axis description.
    const harmonicsYAxisDescriptionProperty = new Property( DEFAULT_Y_AXIS_DESCRIPTION, {
      validValues: [ DEFAULT_Y_AXIS_DESCRIPTION ]
    } );

    // @public
    this.harmonicsChart = new DiscreteHarmonicsChart( this.fourierSeries, emphasizedHarmonics,
      this.domainProperty, this.seriesTypeProperty, this.tProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, harmonicsYAxisDescriptionProperty, {
        tandem: options.tandem.createTandem( 'harmonicsChart' )
      } );

    // {Property.<AxisDescription>} y-axis description is specific to the Sum chart, not shared with the Harmonics
    // chart. Sum chart has zoom buttons, with an AxisDescription for each zoom level.
    const sumYAxisDescriptionProperty = new Property( DEFAULT_Y_AXIS_DESCRIPTION, {
      validValues: DiscreteYAxisDescriptions
    } );

    // @public
    this.sumChart = new DiscreteSumChart( this.fourierSeries, this.domainProperty, this.seriesTypeProperty,
      this.tProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty, sumYAxisDescriptionProperty,
      this.waveformProperty, {
        tandem: options.tandem.createTandem( 'sumChart' )
      } );

    // @public emits if you try to make a sawtooth wave with cosines
    this.oopsSawtoothWithCosinesEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'oopsSawtoothWithCosinesEmitter' )
    } );

    // umultilink is not needed.
    Property.multilink(
      [ this.fourierSeries.numberOfHarmonicsProperty, this.waveformProperty, this.seriesTypeProperty ],
      () => this.updateAmplitudes()
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

      // Reset Properties
      this.isPlayingProperty.reset();
      this.tProperty.reset();
      this.waveformProperty.reset();
      this.seriesTypeProperty.reset();
      this.domainProperty.reset();
      this.equationFormProperty.reset();
      xAxisDescriptionProperty.reset();
      this.fourierSeriesSoundEnabledProperty.reset();
      this.fourierSeriesSoundOutputLevelProperty.reset();

      // Reset subcomponents
      this.fourierSeries.reset();
      emphasizedHarmonics.reset();
      this.wavelengthTool.reset();
      this.periodTool.reset();
      this.harmonicsChart.reset();
      this.sumChart.reset();

      // Update the amplitudes of the Fourier series to match Property settings.
      this.updateAmplitudes();
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

  /**
   * Updates amplitudes to match a pre-defined waveform.
   * @private
   */
  updateAmplitudes() {

    const waveform = this.waveformProperty.value;
    const seriesType = this.seriesTypeProperty.value;

    if ( waveform === Waveform.SAWTOOTH && seriesType === SeriesType.COSINE ) {
      phet.log && phet.log( 'not possible to make a sawtooth out of cosines, switching to sine' );
      this.oopsSawtoothWithCosinesEmitter.emit();

      // Switch to sine on the next tick, so that we don't have a reentry problem with seriesTypeProperty.
      animationFrameTimer.runOnNextTick( () => {
        this.seriesTypeProperty.value = SeriesType.SINE;
      } );
    }
    else if ( waveform !== Waveform.CUSTOM ) {
      const numberOfHarmonics = this.fourierSeries.numberOfHarmonicsProperty.value;
      const amplitudes = waveform.getAmplitudes( numberOfHarmonics, seriesType );

      // Add zero amplitudes as needed, so that we have an amplitude for every harmonic in fourierSeries.
      for ( let i = amplitudes.length; i < this.fourierSeries.harmonics.length; i++ ) {
        amplitudes.push( 0 );
      }
      this.fourierSeries.setAmplitudes( amplitudes );
    }
  }
}

fourierMakingWaves.register( 'DiscreteModel', DiscreteModel );
export default DiscreteModel;
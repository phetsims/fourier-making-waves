// Copyright 2020, University of Colorado Boulder

//TODO split into separate models HarmonicsChart and SumChart, or leave combines since they share x-axis scale?
/**
 * DiscreteChartsModel is the model for charts in the 'Discrete' screen.
 * An instance of this sub-model is instantiated by DiscreteModel.
 * We do not have separate models for the Harmonics chart and Sum chart because they share the same zoom level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWUtils from '../../common/FMWUtils.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

//TODO compute this based on zoom level and harmonic order, because higher-order harmonics require more points to look good
// Number of points in the data set for each harmonic. This value was chosen empirically, such that the highest order
// harmonic looks smooth when the chart is fully zoomed out.
const POINTS_PER_DATA_SET = 2000;

class DiscreteChartsModel {

  constructor() {

    // @public whether the Harmonics chart is visible
    this.harmonicsChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart is visible
    this.sumChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart's y-axis automatically scales to fit its data set
    this.autoScaleProperty = new BooleanProperty( false );

    // @public whether the Sum chart shows what the waveform looks like for an infinite Fourier series
    this.infiniteHarmonicsVisibleProperty = new BooleanProperty( false );

    // @public the harmonics to be emphasized in the Harmonics chart, as the result of UI interactions
    this.emphasizedHarmonics = new EmphasizedHarmonics();

    //TODO this is not used yet, but this is where data sets for each harmonic should live
    // @public {Array.<Property.<Array.<Vector2>>>} a data set for each harmonic, indexed in harmonic order
    this.harmonicDataSets = [];
    for ( let i = 0; i < FMWConstants.MAX_HARMONICS; i++ ) {
      this.harmonicDataSets.push( new Property( [], {
        isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
      } ) );
    }

    // @public {Property.<Array.<Vector2>>>} the data set for the sum of the harmonics
    this.sumDataSetProperty = new Property( [], {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
    } );

    // @public zoom level for the x axis, index into AxisDescription.X_AXIS_DESCRIPTIONS
    this.xZoomLevelProperty = new NumberProperty( AxisDescription.X_DEFAULT_ZOOM_LEVEL, {
      numberType: 'Integer',
      range: new Range( 0, AxisDescription.X_AXIS_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<AxisDescription>} describes the properties of the x axis. dispose is not needed
    this.xAxisDescriptionProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => AxisDescription.X_AXIS_DESCRIPTIONS[ xZoomLevel ]
    );

    // @public zoom level for the y axis, index into AxisDescription.Y_AXIS_DESCRIPTIONS
    this.yZoomLevelProperty = new NumberProperty( AxisDescription.Y_DEFAULT_ZOOM_LEVEL, {
      numberType: 'Integer',
      range: new Range( 0, AxisDescription.Y_AXIS_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<AxisDescription>} describes the properties of the y axis. dispose is not needed
    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => AxisDescription.Y_AXIS_DESCRIPTIONS[ yZoomLevel ]
    );

    // @private
    this.resetDiscreteChartsModel = () => {

      this.emphasizedHarmonics.clear();

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetDiscreteChartsModel();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Creates the data set for one harmonic.
   * @param {Harmonic} harmonic
   * @param {Range} xRange
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} L
   * @param {number} T
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  static createHarmonicDataSet( harmonic, xRange, domain, seriesType, L, T, t ) {

    assert && assert( xRange instanceof Range, 'invalid xRange' );
    // other args are validated by getAmplitudeAt

    const dataSet = [];
    const dx = xRange.getLength() / POINTS_PER_DATA_SET;
    for ( let x = xRange.min; x <= xRange.max; x += dx ) {
      const y = getAmplitudeAt( x, harmonic, domain, seriesType, L, T, t );
      dataSet.push( new Vector2( x, y ) );
    }
    return dataSet;
  }

  //TODO use createHarmonicDataSet here, and pass in dx?
  /**
   * Creates the data set for the sum of harmonics. The datasets for each harmonic are optimized for the resolution
   * needed for that harmonic, so we can't rely on a common dx.  So rather than reuse those datasets, the contribution
   * of each harmonic is explicitly computed here.
   * @param {Harmonic[]} harmonics
   * @param {Range} xRange
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} L
   * @param {number} T
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  static createSumDataSet( harmonics, xRange, domain, seriesType, L, T, t ) {

    assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
    assert && assert( harmonics.length > 0, 'at least 1 harmonic is required' );
    assert && assert( xRange instanceof Range, 'invalid xRange' );
    // other args are validated by getAmplitudeAt

    const sumDataSet = [];
    const dx = xRange.getLength() / POINTS_PER_DATA_SET;
    for ( let x = xRange.min; x <= xRange.max; x += dx ) {
      let ySum = 0;
      harmonics.forEach( harmonic => {
        ySum += getAmplitudeAt( x, harmonic, domain, seriesType, L, T, t );
      } );
      sumDataSet.push( new Vector2( x, ySum ) );
    }
    return sumDataSet;
  }
}

/**
 * Gets the amplitude at an x coordinate, where the semantics of x depends on what the domain is.
 * This algorithm uses the equation that corresponds to EquationForm.MODE.
 * @param {number} x
 * @param {Harmonic} harmonic
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @param {number} L
 * @param {number} T
 * @param {number} t
 * @returns {number}
 */
function getAmplitudeAt( x, harmonic, domain, seriesType, L, T, t ) {

  assert && assert( typeof x === 'number', 'invalid x' );
  assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
  assert && assert( Domain.includes( domain ), 'invalid domain' );
  assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
  assert && AssertUtils.assertPositiveNumber( L );
  assert && AssertUtils.assertPositiveNumber( T );
  assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );

  const order = harmonic.order;
  const amplitude = harmonic.amplitudeProperty.value;

  let y;
  if ( domain === Domain.SPACE ) {
    if ( seriesType === SeriesType.SINE ) {
      y = amplitude * Math.sin( 2 * Math.PI * order * x / L );
    }
    else {
      y = amplitude * Math.cos( 2 * Math.PI * order * x / L );
    }
  }
  else if ( domain === Domain.TIME ) {
    if ( seriesType === SeriesType.SINE ) {
      y = amplitude * Math.sin( 2 * Math.PI * order * x / T );
    }
    else {
      y = amplitude * Math.cos( 2 * Math.PI * order * x / T );
    }
  }
  else { // Domain.SPACE_AND_TIME
    if ( seriesType === SeriesType.SINE ) {
      y = amplitude * Math.sin( 2 * Math.PI * order * ( x / L - t / T ) );
    }
    else {
      y = amplitude * Math.cos( 2 * Math.PI * order * ( x / L - t / T ) );
    }
  }
  return y;
}

fourierMakingWaves.register( 'DiscreteChartsModel', DiscreteChartsModel );
export default DiscreteChartsModel;
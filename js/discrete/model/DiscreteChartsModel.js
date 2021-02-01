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
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

//TODO compute this dynamically, so that fewer points are needed as we zoom in.
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
   * Creates the data set for one harmonic. This algorithm uses the equation that corresponds to EquationForm.MODE.
   * @param {number} order
   * @param {number} amplitude
   * @param {Range} xRange
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} L
   * @param {number} T
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  static createHarmonicDataSet( order, amplitude, xRange, domain, seriesType, L, T, t ) {

    assert && AssertUtils.assertPositiveInteger( order );
    assert && assert( typeof amplitude === 'number', 'invalid amplitude' );
    assert && assert( xRange instanceof Range, 'invalid xRange' );
    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );

    const dx = xRange.getLength() / POINTS_PER_DATA_SET;

    const dataSet = [];
    for ( let x = xRange.min; x <= xRange.max; x += dx ) {
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
      dataSet.push( new Vector2( x, y ) );
    }
    return dataSet;
  }

  //TODO compute sum separately instead of reusing harmonicDataSets, so that each harmonicDataSet can have different # points
  /**
   * Creates the data set for the sum of harmonics.
   * @param {Array.<Array.<Vector2>>} harmonicDataSets - data sets to be summed
   * @returns {Vector2[]}
   * @public
   */
  static createSumDataSet( harmonicDataSets ) {

    assert && assert( Array.isArray( harmonicDataSets ), 'invalid harmonicDataSets' );
    assert && assert( harmonicDataSets.length > 0, 'at least 1 data set is required' );

    // All data sets must have the same number of points.
    const numberOfPoints = harmonicDataSets[ 0 ].length;
    assert && assert( _.every( harmonicDataSets, dataSet => dataSet.length === numberOfPoints ),
      'all data sets used to create the sum must have the same number of points' );

    // Sum the corresponding y values of the relevant data sets.
    const numberOfDataSets = harmonicDataSets.length;
    const sumDataSet = [];
    for ( let pointIndex = 0; pointIndex < numberOfPoints; pointIndex++ ) {
      let ySum = 0;
      const x = harmonicDataSets[ 0 ][ pointIndex ].x;
      for ( let dataSetIndex = 0; dataSetIndex < numberOfDataSets; dataSetIndex++ ) {
        const point = harmonicDataSets[ dataSetIndex ][ pointIndex ];
        assert && assert( point.x === x, `all data sets should have the same x coordinates, ${point.x} !== ${x}` );
        ySum += point.y;
      }
      sumDataSet.push( new Vector2( x, ySum ) );
    }
    return sumDataSet;
  }
}

fourierMakingWaves.register( 'DiscreteChartsModel', DiscreteChartsModel );
export default DiscreteChartsModel;
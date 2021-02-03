// Copyright 2020, University of Colorado Boulder

/**
 * SumChart is the model for the 'Sum' chart in the 'Discrete' screen.
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
import FMWUtils from '../../common/FMWUtils.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

// Number of points in the data set for each harmonic. This value was chosen empirically, so that the plot looks
// smooth when the chart is fully zoomed out.
const POINTS_PER_DATA_SET = 2000;

class SumChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<number>} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xZoomLevelProperty, xAxisDescriptionProperty ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xZoomLevelProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart's y-axis automatically scales to fit its data set
    this.autoScaleProperty = new BooleanProperty( false );

    // @public whether the Sum chart shows what the waveform looks like for an infinite Fourier series
    this.infiniteHarmonicsVisibleProperty = new BooleanProperty( false );

    // @public x-axis zoom level and description is shared with the Harmonics chart
    this.xZoomLevelProperty = xZoomLevelProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;

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

    // {Vector[2]} the default data set for the sum
    const defaultSumDataSet = createSumDataSet( fourierSeries.harmonics, fourierSeries.numberOfHarmonicsProperty.value,
      xAxisDescriptionProperty.value.range, domainProperty.value, seriesTypeProperty.value,
      fourierSeries.L, fourierSeries.T, tProperty.value );

    // @public {Property.<Vector2[]>} the data set for the sum
    this.sumDataSetProperty = new Property( defaultSumDataSet, {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
    } );

    //TODO duplication with defaultSumDataSet above
    // Update the sum when dependencies change. unmultilink is not needed.
    const amplitudeProperties = _.map( fourierSeries.harmonics, harmonic => harmonic.amplitudeProperty );
    Property.lazyMultilink( [ fourierSeries.numberOfHarmonicsProperty, xAxisDescriptionProperty,
        domainProperty, seriesTypeProperty, tProperty, ...amplitudeProperties ],
      ( numberOfHarmonics, xAxisDescription, domain, seriesType, t ) => {
        this.sumDataSetProperty.value = createSumDataSet( fourierSeries.harmonics, numberOfHarmonics,
          xAxisDescription.range, domain, seriesType, fourierSeries.L, fourierSeries.T, t );
      } );

    // @private
    this.resetSumChart = () => {

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetSumChart();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

//TODO use createHarmonicDataSet here, and pass in dx?
//TODO move to FourierSeries?
/**
 * Creates the data set for the sum of harmonics. The datasets for each harmonic are optimized for the resolution
 * needed for that harmonic, so we can't rely on a common dx.  So rather than reuse those datasets, the contribution
 * of each harmonic is explicitly computed here.
 * @param {Harmonic[]} harmonics
 * @param {number} numberOfHarmonics
 * @param {Range} xRange
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @param {number} L
 * @param {number} T
 * @param {number} t
 * @returns {Vector2[]}
 */
function createSumDataSet( harmonics, numberOfHarmonics, xRange, domain, seriesType, L, T, t ) {

  assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
  assert && assert( harmonics.length > 0, 'at least 1 harmonic is required' );
  assert && assert( typeof numberOfHarmonics === 'number' && numberOfHarmonics > 0, 'invalid numberOfHarmonics' );
  assert && assert( xRange instanceof Range, 'invalid xRange' );
  // other args are validated by getAmplitudeAt

  const relevantHarmonics = harmonics.slice( 0, numberOfHarmonics );
  const sumDataSet = [];
  const dx = xRange.getLength() / POINTS_PER_DATA_SET;
  for ( let x = xRange.min; x <= xRange.max; x += dx ) {
    let ySum = 0;
    relevantHarmonics.forEach( harmonic => {
      ySum += FourierSeries.getAmplitudeAt( x, harmonic, domain, seriesType, L, T, t );
    } );
    sumDataSet.push( new Vector2( x, ySum ) );
  }
  return sumDataSet;
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;
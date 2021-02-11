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
import FMWConstants from '../../common/FMWConstants.js';
import FMWUtils from '../../common/FMWUtils.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

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

    /**
     * Creates the sum data set using current arg values.
     * @returns {Vector2[]}
     */
    const createDataSet = () => {
      return fourierSeries.createSumDataSet( this.xAxisDescriptionProperty.value,
        domainProperty.value, seriesTypeProperty.value, tProperty.value );
    };

    // @public {Property.<Vector2[]>} the data set for the sum
    this.sumDataSetProperty = new Property( createDataSet(), {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
    } );

    //TODO performance: determine this while creating the sum data set
    // @public {DerivedProperty.<number>} the maximum amplitude of the sum
    this.maxAmplitudeProperty = new DerivedProperty(
      [ this.sumDataSetProperty ],
      sumDataSet => _.maxBy( sumDataSet, point => point.y ).y
    );
    assert && assert( 2 * AxisDescription.X_FULLY_ZOOMED_OUT.absoluteMax >= 0.5,
      'max amplitude is in data set only if at least 1/2 of the sum is visible when fully zoomed out' );

    //TODO derive this value only while auto scale is enabled?
    // @public (read-only) {DerivedProperty.<Range>} auto-scale range of the y axis, fitted to the sum's max amplitude
    this.yAxisAutoScaleRangeProperty = new DerivedProperty(
      [ this.maxAmplitudeProperty ],
      maxAmplitude => {
        // no smaller than range of amplitude sliders!
        const maxY = Math.max( maxAmplitude, FMWConstants.MAX_ABSOLUTE_AMPLITUDE );
        return new Range( -maxY, maxY );
      } );

    // The initial y-axis zoom level depends on whether auto scale is initially enabled.
    const initialYZoomLevel = this.autoScaleProperty.value ?
                              getZoomLevelForYRange( this.yAxisAutoScaleRangeProperty.value ) :
                              AxisDescription.Y_DEFAULT_ZOOM_LEVEL;

    // @public zoom level for the y axis, index into AxisDescription.Y_AXIS_DESCRIPTIONS
    this.yZoomLevelProperty = new NumberProperty( initialYZoomLevel, {
      numberType: 'Integer',
      range: new Range( 0, AxisDescription.Y_AXIS_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<AxisDescription>} describes the properties of the y axis. dispose is not needed
    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => AxisDescription.Y_AXIS_DESCRIPTIONS[ yZoomLevel ]
    );

    // When auto scale is enabled, link this listener to yAxisAutoScaleRangeProperty, and adjust the y-axis zoom
    // range so that's it's appropriate for the auto-scale range.
    const updateZoomLevel = yAxisAutoScaleRange => {
      assert && assert( this.autoScaleProperty.value, 'should not be called when auto scale is disabled' );
      this.yZoomLevelProperty.value = getZoomLevelForYRange( yAxisAutoScaleRange );
    };
    this.autoScaleProperty.link( autoScale => {
      if ( autoScale ) {
        this.yAxisAutoScaleRangeProperty.link( updateZoomLevel );
      }
      else {
        if ( this.yAxisAutoScaleRangeProperty.hasListener( updateZoomLevel ) ) {
          this.yAxisAutoScaleRangeProperty.unlink( updateZoomLevel );
        }
      }
    } );

    // Update the sum when dependencies change. unmultilink is not needed.
    Property.lazyMultilink( [ fourierSeries.amplitudesProperty, fourierSeries.numberOfHarmonicsProperty,
        xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      () => { this.sumDataSetProperty.value = createDataSet(); }
    );

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

/**
 * Gets the zoom level that corresponds to a y-axis range.
 * @param {Range} yRange
 * @returns {number} - the zoom level, an index into AxisDescription.Y_AXIS_DESCRIPTIONS
 */
function getZoomLevelForYRange( yRange ) {
  assert && assert( yRange instanceof Range, 'invalid yRange' );
  const yAxisDescriptions = AxisDescription.Y_AXIS_DESCRIPTIONS;
  let zoomLevel = yAxisDescriptions.length - 1;
  for ( let i = 0; i < yAxisDescriptions.length - 1; i++ ) {
    if ( yRange.max >= yAxisDescriptions[ i ].absoluteMax ) {
      zoomLevel = i;
      break;
    }
  }
  assert && assert( zoomLevel >= 0 && zoomLevel < yAxisDescriptions.length, `invalid zoomLevel: ${zoomLevel}` );
  return zoomLevel;
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;
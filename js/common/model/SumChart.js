// Copyright 2021, University of Colorado Boulder

//TODO change this to display the sums for more than 1 FourierSeries?
/**
 * SumChart is the model base class for the 'Sum' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../discrete/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import Domain from './Domain.js';
import FourierSeries from './FourierSeries.js';
import SeriesType from './SeriesType.js';

class SumChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xZoomLevelProperty,
               xAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && assert( xZoomLevelProperty instanceof NumberProperty );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.domainProperty = domainProperty;
    this.xZoomLevelProperty = xZoomLevelProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;

    // @public whether the Sum chart's y-axis automatically scales to fit its data set
    this.autoScaleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'autoScaleProperty' )
    } );

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
      //TODO tandem
    } );

    //TODO performance: determine this while creating the sum data set
    // @public {DerivedProperty.<number>} the maximum amplitude of the sum
    this.maxAmplitudeProperty = new DerivedProperty(
      [ this.sumDataSetProperty ],
      sumDataSet => _.maxBy( sumDataSet, point => point.y ).y
    );
    assert && assert( 2 * AxisDescription.X_FULLY_ZOOMED_OUT.absoluteMax >= 0.5,
      'max amplitude is in data set only if at least 1/2 of the wavelength is visible when fully zoomed out' );

    //TODO derive this value only while auto scale is enabled?
    // @public (read-only) {DerivedProperty.<Range>} auto-scale range of the y axis, fitted to the sum's max amplitude
    this.yAxisAutoScaleRangeProperty = new DerivedProperty(
      [ this.maxAmplitudeProperty ],
      maxAmplitude => {
        // no smaller than range of amplitude sliders!
        const maxY = Math.max( maxAmplitude, FMWConstants.MAX_ABSOLUTE_AMPLITUDE );
        return new Range( -maxY, maxY );
      }, {
        //TODO tandem
      } );

    // The initial y-axis zoom level depends on whether auto scale is initially enabled.
    const initialYZoomLevel = this.autoScaleProperty.value ?
                              AxisDescription.getZoomLevelForRange( this.yAxisAutoScaleRangeProperty.value, AxisDescription.Y_AXIS_DESCRIPTIONS ) :
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
      this.yZoomLevelProperty.value = AxisDescription.getZoomLevelForRange( yAxisAutoScaleRange, AxisDescription.Y_AXIS_DESCRIPTIONS );
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
    Property.lazyMultilink( [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty,
        seriesTypeProperty, tProperty ],
      () => { this.sumDataSetProperty.value = createDataSet(); }
    );
  }

  /**
   * @public
   */
  reset() {
    this.autoScaleProperty.reset();
    this.sumDataSetProperty.reset();
    this.yZoomLevelProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;
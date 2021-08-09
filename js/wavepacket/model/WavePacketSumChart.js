// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumChart is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import SeriesType from '../../common/model/SeriesType.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

// An empty data set, used so that we can rely on value comparison in Property, and not trigger notifications when
// the value changes from one [] to another [].  This is a performance optimization.
const EMPTY_DATA_SET = Object.freeze( [] );

class WavePacketSumChart extends WaveformChart {

  /**
   * @param {DerivedProperty.<Array.<Array.<Vector2>>>} componentDataSetsProperty
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<Domain>} seriesTypeProperty
   * @param {EnumerationProperty.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( componentDataSetsProperty, wavePacket, domainProperty, seriesTypeProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty,
               yAxisDescriptionProperty, widthIndicatorsVisibleProperty, options ) {
    assert && assert( componentDataSetsProperty instanceof DerivedProperty );
    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( wavePacket.L, wavePacket.T, domainProperty, xAxisTickLabelFormatProperty,
      xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // @public
    this.wavePacket = wavePacket;
    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty;

    // @public whether this chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );

    // @public whether the envelope of the sum waveform is visible
    this.waveformEnvelopeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'waveformEnvelopeVisibleProperty' )
    } );

    // {DerivedProperty.<Array.<Vector2>>}
    // Data set for the sum of a finite number of components, EMPTY_DATA_SET when the number of components is infinite.
    // This simply takes the data sets for components, and sums the y values (amplitudes) of corresponding x values.
    // Points are ordered by increasing x value.
    const finiteSumDataSetProperty = new DerivedProperty(
      [ componentDataSetsProperty ],
      componentDataSets => {
        let dataSet = EMPTY_DATA_SET;
        if ( componentDataSets.length > 0 ) {
          dataSet = sumDataSets( componentDataSets );
        }
        return dataSet;
      } );

    // {DerivedProperty.<Array.<Vector2>>}
    // Data set for the sum of an infinite number of components, EMPTY_DATA_SET when the number of components is finite.
    // Points are ordered by increasing x value.
    const infiniteSumDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.conjugateStandardDeviationProperty,
        seriesTypeProperty, xAxisDescriptionProperty ],
      ( componentSpacing, center, conjugateStandardDeviation, seriesType, xAxisDescription ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( componentSpacing === 0 ) {
          dataSet = createWavePacketDataSet( center, conjugateStandardDeviation, seriesType, xAxisDescription.range );
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<Array.<Vector2>>} data set for the sum.
    // One of these dependencies will be EMPTY_DATA_SET and the other will contain points, depending on whether the
    // number of Fourier components is finite or infinite.
    this.sumDataSetProperty = new DerivedProperty(
      [ finiteSumDataSetProperty, infiniteSumDataSetProperty ],
      ( finiteDataSet, infiniteDataSet ) =>
        ( wavePacket.getNumberOfComponents() === Infinity ) ? infiniteDataSet : finiteDataSet
    );

    // {DerivedProperty.<Vector2[]>} data set for the waveform envelope of a wave packet with infinite
    // components, EMPTY_DATA_SET when the number of components is finite or the envelope is not visible.
    // This is computed using 2 wave packet waveforms USING THE FOURIER COMPONENTS - one for sine, one for cosine -
    // then combining y values. Points are ordered by increasing x value.
    // This is based on the updateEnvelope method in D2CSumView.js.
    const finiteWaveformEnvelopeDataSetProperty = new DerivedProperty(
      [ this.waveformEnvelopeVisibleProperty, componentDataSetsProperty ],
      ( waveformEnvelopeVisible, componentsDataSet ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( waveformEnvelopeVisible && componentsDataSet.length > 0 ) {
          dataSet = [ new Vector2( -2, -2 ), new Vector2( 2, 2 ) ]; //TODO dummy data
        }
        return dataSet;
      } );

    // {DerivedProperty.<Vector2[]>} data set for the waveform envelope of a wave packet with infinite
    // components, EMPTY_DATA_SET when the number of components is finite or the envelope is not visible.
    // This is computed using 2 wave packet waveforms - one for sine, one for cosine - then combining y values.
    // Points are ordered by increasing x value.
    const infiniteWaveformEnvelopeDataSetProperty = new DerivedProperty(
      [ this.waveformEnvelopeVisibleProperty, wavePacket.componentSpacingProperty, wavePacket.centerProperty,
        wavePacket.conjugateStandardDeviationProperty, seriesTypeProperty, xAxisDescriptionProperty ],
      ( waveformEnvelopeVisible, componentSpacing, center, conjugateStandardDeviation, seriesType, xAxisDescription ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( waveformEnvelopeVisible && componentSpacing === 0 ) {

          // Compute data sets for the same wave packet, using sin and cos.
          const sinDataSet = createWavePacketDataSet( center, conjugateStandardDeviation, SeriesType.SINE, xAxisDescription.range );
          const cosDataSet = createWavePacketDataSet( center, conjugateStandardDeviation, SeriesType.COSINE, xAxisDescription.range );
          assert && assert( sinDataSet.length === cosDataSet.length );

          // Combine the 2 data sets to create the envelope.
          dataSet = createEnvelopeDataSet( sinDataSet, cosDataSet );
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<Array.<Vector2>>} data set for the waveform envelope.
    // One of these dependencies will be EMPTY_DATA_SET and the other will contain points, depending on whether the
    // number of Fourier components is finite or infinite.
    this.waveformEnvelopeDataSetProperty = new DerivedProperty(
      [ finiteWaveformEnvelopeDataSetProperty, infiniteWaveformEnvelopeDataSetProperty ],
      ( finiteDataSet, infiniteDataSet ) =>
        ( wavePacket.getNumberOfComponents() === Infinity ) ? infiniteDataSet : finiteDataSet
    );

    // @public {DerivedProperty.<number>} the maximum amplitude, used to scale the chart's y axis.
    // If we're in a transition between finite and infinite components, there can be an intermediate state
    // where both data sets are empty. In that case, maxAmplitudeProperty is zero.
    this.maxAmplitudeProperty = new DerivedProperty(
      [ this.waveformEnvelopeVisibleProperty, this.waveformEnvelopeDataSetProperty, this.sumDataSetProperty ],
      ( waveformEnvelopeVisible, waveformEnvelopeDataSet, sumDataSet ) => {

        // Choose the data set that determines the maximum amplitude.
        const dataSet = waveformEnvelopeVisible ? waveformEnvelopeDataSet : sumDataSet;

        // Find the maximum amplitude in that data set. Use a small value to ensure that it's non-zero.
        let maxAmplitude = 0;
        if ( dataSet.length > 0 ) {
          maxAmplitude = Math.max( 1e-6, _.maxBy( dataSet, point => point.y ).y );
        }
        return maxAmplitude;
      } );


    // @public {Vector2} width displayed by the width indicator
    // This is loosely based on the getModelWidth method in WavePacketXWidthPlot.java.
    this.widthIndicatorWidthProperty = new DerivedProperty(
      [ wavePacket.conjugateStandardDeviationProperty ],
      conjugateStandardDeviation => 2 * conjugateStandardDeviation
    );

    // @public {Vector2} position of the width indicator
    // This is a constant, but the view requires a Property. We use validValues to constrain it to 1 value.
    // This is loosely based on the getModelLocation method in WavePacketXWidthPlot.java.
    const widthIndicatorPosition = new Vector2( 0, 1 / Math.sqrt( Math.E ) );
    this.widthIndicatorPositionProperty = new Vector2Property( widthIndicatorPosition, {
      validValues: [ widthIndicatorPosition ]
    } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
    this.waveformEnvelopeVisibleProperty.reset();
  }
}

/**
 * Create a new data set by summing the y components of data sets. The client is responsible for providing data sets
 * that have the same number of points, and points with the same index must have the same x value.
 * @param {Vector2[][]} dataSets
 * @returns {Vector2[]}
 */
function sumDataSets( dataSets ) {
  assert && assert( Array.isArray( dataSets ) );
  assert && assert( dataSets.length > 0 );
  assert && assert( _.every( dataSets, dataSet => Array.isArray( dataSet ) ) );

  const pointsPerDataSet = dataSets[ 0 ].length;
  assert && assert( pointsPerDataSet > 0, 'Data sets must contain points.' );
  assert && assert( _.every( dataSets, dataSet => dataSet.length === pointsPerDataSet ),
    'All data sets much have the same number of points.' );

  const dataSet = [];
  for ( let i = 0; i < pointsPerDataSet; i++ ) {
    let sum = 0;
    const x = dataSets[ 0 ][ i ].x;
    for ( let j = 0; j < dataSets.length; j++ ) {
      assert && assert( dataSets[ j ][ i ].x === x, 'Points with the same index must have the same x value.' );
      sum += dataSets[ j ][ i ].y;
    }
    dataSet.push( new Vector2( x, sum ) );
  }
  return dataSet;
}

/**
 * Creates a data set for a wave packet approximated using an infinite number of Fourier components.
 * This is based on the updateDataSet method in GaussianWavePacketPlot.java.
 * @param center - the wave packet's center
 * @param conjugateStandardDeviation - the wave packet's conjugate standard deviation, a measure of width
 * @param xRange - range of the Sum chart's x axis
 * @param seriesType - sine or cosine
 * @returns {Vector2[]}
 */
function createWavePacketDataSet( center, conjugateStandardDeviation, seriesType, xRange ) {
  assert && AssertUtils.assertPositiveNumber( center );
  assert && AssertUtils.assertPositiveNumber( conjugateStandardDeviation );
  assert && assert( SeriesType.includes( seriesType ) );
  assert && assert( xRange instanceof Range );

  const dataSet = [];
  const numberOfPoints = FMWConstants.MAX_POINTS_PER_DATA_SET + 1;
  const dx = xRange.getLength() / numberOfPoints;

  for ( let i = 0; i < numberOfPoints; i++ ) {

    // x
    const x = xRange.min + ( i * dx );

    // y = F(x) = exp( -(x^2) / (2 * (dx^2)) ) * sin(k0*x)
    const sinCosTerm = ( seriesType === SeriesType.SINE ) ? Math.sin( center * x ) : Math.cos( center * x );
    const y = Math.exp( -( x * x ) / ( 2 * ( conjugateStandardDeviation * conjugateStandardDeviation ) ) ) * sinCosTerm;

    dataSet.push( new Vector2( x, y ) );
  }
  return dataSet;
}

/**
 * Creates the data set for the waveform envelope. The client is responsible for providing 2 data sets that describe
 * the same wave packet - one computed using sine, the other computed using cosine. The y values of those 2 data sets
 * are then combined to create the envelope. This is based on the updateEnvelope method in D2CSumView.js.
 * @param {Vector2[]} dataSet1
 * @param {Vector2[]} dataSet2
 * @returns {Vector2[]}
 */
function createEnvelopeDataSet( dataSet1, dataSet2 ) {
  assert && assert( Array.isArray( dataSet1 ) && dataSet1.length > 0 );
  assert && assert( Array.isArray( dataSet2 ) && dataSet2.length > 0 );
  assert && assert( dataSet1.length === dataSet2.length );

  const dataSet = [];
  for ( let i = 0; i < dataSet1.length; i++ ) {

    // x
    const x = dataSet1[ i ].x;
    assert && assert( x === dataSet2[ i ].x, 'points with the same index must have the same x value' );

    // y = sqrt( y1^2 + yCos^2 )
    const y1 = dataSet1[ i ].y;
    const y2 = dataSet2[ i ].y;
    const y = Math.sqrt( ( y1 * y1 ) + ( y2 * y2 ) );

    dataSet.push( new Vector2( x, y ) );
  }
  return dataSet;
}

fourierMakingWaves.register( 'WavePacketSumChart', WavePacketSumChart );
export default WavePacketSumChart;
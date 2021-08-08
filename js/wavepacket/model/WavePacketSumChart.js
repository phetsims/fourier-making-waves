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

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );

    // @public whether the envelope of the sum waveform is visible
    this.waveformEnvelopeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'waveformEnvelopeVisibleProperty' )
    } );

    // @public {DerivedProperty.<Array.<Vector2>>}
    // Data set for the sum of a finite number of components, [] when the number of components is infinite.
    // This simply takes the data sets for components, and sums the y values (amplitudes) of corresponding x values.
    // Points are ordered by increasing x value.
    this.finiteSumDataSetProperty = new DerivedProperty(
      [ componentDataSetsProperty ],
      componentDataSets => {
        const sumDataSet = [];
        if ( componentDataSets.length > 0 ) {

          // Finite number of components
          const pointsPerDataSet = componentDataSets[ 0 ].length;
          assert && assert( pointsPerDataSet > 0 );

          if ( pointsPerDataSet > 0 ) {
            assert && assert( _.every( componentDataSets, dataSet => dataSet.length === pointsPerDataSet ),
              `All data sets much have ${pointsPerDataSet} points.` );

            for ( let i = 0; i < pointsPerDataSet; i++ ) {
              let sum = 0;
              const x = componentDataSets[ 0 ][ i ].x;
              for ( let j = 0; j < componentDataSets.length; j++ ) {
                assert && assert( componentDataSets[ j ][ i ].x === x,
                  'all points with the same index must have the same x coordinate' );
                sum += componentDataSets[ j ][ i ].y;
              }
              sumDataSet.push( new Vector2( x, sum ) );
            }
          }
        }
        return sumDataSet;
      } );

    // @public {DerivedProperty.<Array.<Vector2>>}
    // Data set for the sum of an infinite number of components, [] when the number of components is finite.
    // Points are ordered by increasing x value.
    // This is based on the updateDataSet method in GaussianWavePacketPlot.java.
    this.infiniteSumDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.conjugateStandardDeviationProperty,
        seriesTypeProperty, xAxisDescriptionProperty ],
      ( componentSpacing, center, conjugateStandardDeviation, seriesType, xAxisDescription ) => {
        let dataSet;
        if ( componentSpacing === 0 ) {
          dataSet = createWavePacketDataSet( center, conjugateStandardDeviation, seriesType, xAxisDescription.range );
        }
        else {
          dataSet = [];
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<Vector2[]>} data set for the waveform envelope of a wave packet with infinite
    // components, [] when the number of components is finite. This is computed by computing 2 wave packet waveforms -
    // one for sine, one for cosine - then combining y values. Points are ordered by increasing x value.
    // This is based on the updateEnvelope method in D2CSumView.js.
    this.infiniteWaveformEnvelopeDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.conjugateStandardDeviationProperty,
        seriesTypeProperty, xAxisDescriptionProperty ],
      ( componentSpacing, center, conjugateStandardDeviation, seriesType, xAxisDescription ) => {
        const dataSet = [];
        if ( componentSpacing === 0 ) {

          // Compute the same wave packet, using sin and cos.
          const sinDataSet = createWavePacketDataSet( center, conjugateStandardDeviation, SeriesType.SINE, xAxisDescription.range );
          const cosDataSet = createWavePacketDataSet( center, conjugateStandardDeviation, SeriesType.COSINE, xAxisDescription.range );
          assert && assert( sinDataSet.length === cosDataSet.length );

          // Combine the 2 wave packets.
          for ( let i = 0; i < sinDataSet.length; i++ ) {

            // x
            const x = sinDataSet[ i ].x;
            assert && assert( x === cosDataSet[ i ].x );

            // y = sqrt( ySin^2 + yCos^2 )
            const ySin = sinDataSet[ i ].y;
            const yCos = cosDataSet[ i ].y;
            const y = Math.sqrt( ( ySin * ySin ) + ( yCos * yCos ) );

            dataSet.push( new Vector2( x, y ) );
          }
        }
        return dataSet;
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
 * Creates a data set for a wave packet approximated using an infinite number of Fourier components.
 * @param center - the wave packet's center
 * @param conjugateStandardDeviation - the wave packet's conjugate standard deviation, a measure of width
 * @param xRange - range of the Sum chart's x axis
 * @param seriesType - sine or cosine
 * @returns {*[]}
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

fourierMakingWaves.register( 'WavePacketSumChart', WavePacketSumChart );
export default WavePacketSumChart;
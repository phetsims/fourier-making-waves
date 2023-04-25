// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketSumChart is the model for the 'Sum' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import DomainChart from '../../common/model/DomainChart.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketAxisDescriptions from './WavePacketAxisDescriptions.js';
import WavePacketComponentsChart from './WavePacketComponentsChart.js';
import Domain from '../../common/model/Domain.js';
import AxisDescription from '../../common/model/AxisDescription.js';

// constants
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

export default class WavePacketSumChart extends DomainChart {

  public readonly widthIndicatorsVisibleProperty: Property<boolean>;
  public readonly yAxisDescription: AxisDescription;

  // whether the envelope of the sum waveform is visible
  public readonly waveformEnvelopeVisibleProperty: Property<boolean>;

  // Data set for the sum. One of these dependencies will be EMPTY_DATA_SET and the other will contain points,
  // depending on whether the number of Fourier components is finite or infinite.
  public readonly sumDataSetProperty: TReadOnlyProperty<Vector2[]>;

  // Data set for the waveform envelope. One of these dependencies will be EMPTY_DATA_SET and the other will
  // contain points, depending on whether the number of Fourier components is finite or infinite.
  public readonly waveformEnvelopeDataSetProperty: TReadOnlyProperty<Vector2[]>;

  // Width displayed by the width indicator. This is loosely based on the getModelWidth method in WavePacketXWidthPlot.java.
  public readonly widthIndicatorWidthProperty: TReadOnlyProperty<number>;

  // Position of the width indicator. This is effectively a constant, see below.
  public readonly widthIndicatorPositionProperty: TReadOnlyProperty<Vector2>;

  public constructor( componentDataSetsProperty: TReadOnlyProperty<Vector2[][]>,
                      wavePacket: WavePacket,
                      domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      xAxisDescriptionProperty: Property<AxisDescription>,
                      widthIndicatorsVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    super( domainProperty, xAxisDescriptionProperty, wavePacket.L, wavePacket.T, tandem );

    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty;
    this.yAxisDescription = WavePacketAxisDescriptions.SUM_Y_AXIS_DESCRIPTION;

    this.waveformEnvelopeVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'waveformEnvelopeVisibleProperty' )
    } );

    // Data set for the sum of a finite number of components, EMPTY_DATA_SET when the number of components is infinite.
    // This simply takes the data sets for components, and sums the y values (amplitudes) of corresponding x values.
    // Points are ordered by increasing x value.
    const finiteSumDataSetProperty = new DerivedProperty(
      [ componentDataSetsProperty ],
      componentDataSets => {
        let dataSet: Vector2[] = EMPTY_DATA_SET;
        if ( componentDataSets.length > 0 ) {
          dataSet = createSumDataSet( componentDataSets );
        }
        return dataSet;
      } );

    // Data set for the sum of an infinite number of components, EMPTY_DATA_SET when the number of components is finite.
    // Points are ordered by increasing x value.
    const infiniteSumDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.conjugateStandardDeviationProperty,
        seriesTypeProperty, xAxisDescriptionProperty ],
      ( componentSpacing, center, conjugateStandardDeviation, seriesType, xAxisDescription ) => {
        let dataSet: Vector2[] = EMPTY_DATA_SET;
        if ( componentSpacing === 0 ) {
          dataSet = createWavePacketDataSet( center, conjugateStandardDeviation, seriesType, xAxisDescription.range );
        }
        return dataSet;
      } );

    this.sumDataSetProperty = new DerivedProperty(
      [ finiteSumDataSetProperty, infiniteSumDataSetProperty ],
      ( finiteDataSet, infiniteDataSet ) =>
        ( wavePacket.getNumberOfComponents() === Infinity ) ? infiniteDataSet : finiteDataSet
    );

    // {DerivedProperty.<Vector2[]>} Data set for the waveform envelope of a wave packet with infinite
    // components, EMPTY_DATA_SET when the number of components is finite or the envelope is not visible.
    // This is computed using 2 wave packet waveforms USING THE FOURIER COMPONENTS - one for sine, one for cosine -
    // then combining y values. Points are ordered by increasing x value.
    // This is based on the updateEnvelope method in D2CSumView.js.
    const finiteWaveformEnvelopeDataSetProperty = new DerivedProperty(
      [ this.waveformEnvelopeVisibleProperty, finiteSumDataSetProperty ],
      ( waveformEnvelopeVisible, finiteSumDataSet ) => {
        let dataSet: Vector2[] = EMPTY_DATA_SET;
        if ( waveformEnvelopeVisible && finiteSumDataSet.length > 0 ) {

          // We'll be using finiteSumDataSet as one of the data sets. It was computed for either a SeriesType,
          // either sine or cosine. Compute the other data set by creating component data sets using the other
          // SeriesType, then summing those data sets.
          const seriesType = ( seriesTypeProperty.value === SeriesType.SIN ) ? SeriesType.COS : SeriesType.SIN;
          const otherComponentDataSets = WavePacketComponentsChart.createComponentsDataSets(
            wavePacket.componentsProperty.value, wavePacket.componentSpacingProperty.value, domainProperty.value,
            seriesType, xAxisDescriptionProperty.value.range
          );
          const otherSumDataSet = createSumDataSet( otherComponentDataSets );

          // Combine the 2 data sets to create the envelope.
          dataSet = createEnvelopeDataSet( finiteSumDataSet, otherSumDataSet );
        }
        return dataSet;
      } );

    // {DerivedProperty.<Vector2[]>} Data set for the waveform envelope of a wave packet with infinite
    // components, EMPTY_DATA_SET when the number of components is finite or the envelope is not visible.
    // This is computed using 2 wave packet waveforms - one for sine, one for cosine - then combining y values.
    // Points are ordered by increasing x value.
    const infiniteWaveformEnvelopeDataSetProperty = new DerivedProperty(
      [ this.waveformEnvelopeVisibleProperty, wavePacket.componentSpacingProperty, wavePacket.centerProperty,
        wavePacket.conjugateStandardDeviationProperty, seriesTypeProperty, xAxisDescriptionProperty ],
      ( waveformEnvelopeVisible, componentSpacing, center, conjugateStandardDeviation, seriesType, xAxisDescription ) => {
        let dataSet: Vector2[] = EMPTY_DATA_SET;
        if ( waveformEnvelopeVisible && componentSpacing === 0 ) {

          // Compute data sets for the same wave packet, using sin and cos.
          const sinDataSet = createWavePacketDataSet( center, conjugateStandardDeviation, SeriesType.SIN, xAxisDescription.range );
          const cosDataSet = createWavePacketDataSet( center, conjugateStandardDeviation, SeriesType.COS, xAxisDescription.range );
          assert && assert( sinDataSet.length === cosDataSet.length );

          // Combine the 2 data sets to create the envelope.
          dataSet = createEnvelopeDataSet( sinDataSet, cosDataSet );
        }
        return dataSet;
      } );

    this.waveformEnvelopeDataSetProperty = new DerivedProperty(
      [ finiteWaveformEnvelopeDataSetProperty, infiniteWaveformEnvelopeDataSetProperty ],
      ( finiteDataSet, infiniteDataSet ) =>
        ( wavePacket.getNumberOfComponents() === Infinity ) ? infiniteDataSet : finiteDataSet
    );

    this.widthIndicatorWidthProperty = new DerivedProperty(
      [ wavePacket.conjugateStandardDeviationProperty ],
      conjugateStandardDeviation => 2 * conjugateStandardDeviation
    );

    // This is a constant, but the view requires a Property. We use validValues to constrain it to 1 value.
    // This is based on the getModelLocation method in WavePacketXWidthPlot.java.
    const widthIndicatorPosition = new Vector2( 0, 1 / Math.sqrt( Math.E ) );
    this.widthIndicatorPositionProperty = new Vector2Property( widthIndicatorPosition, {
      validValues: [ widthIndicatorPosition ]
    } );
  }

  public override reset(): void {
    super.reset();
    this.waveformEnvelopeVisibleProperty.reset();
  }
}

/**
 * Create a new data set by summing the y components of data sets. The provided data sets must have the same number
 * of points, and points with the same index must have the same x value.
 */
function createSumDataSet( dataSets: Vector2[][] ): Vector2[] {
  assert && assert( dataSets.length > 0 );

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
 * @param seriesType - sine or cosine
 * @param xRange - range of the Sum chart's x-axis
 */
function createWavePacketDataSet( center: number, conjugateStandardDeviation: number, seriesType: SeriesType, xRange: Range ): Vector2[] {
  assert && assert( center > 0 );
  assert && assert( conjugateStandardDeviation > 0 );

  const dataSet = [];
  const numberOfPoints = FMWConstants.MAX_POINTS_PER_DATA_SET + 1;
  const dx = xRange.getLength() / numberOfPoints;

  for ( let i = 0; i < numberOfPoints; i++ ) {

    // x
    const x = xRange.min + ( i * dx );

    // y = F(x) = exp( -(x^2) / (2 * (dx^2)) ) * sin(k0*x)
    const sinCosTerm = ( seriesType === SeriesType.SIN ) ? Math.sin( center * x ) : Math.cos( center * x );
    const y = Math.exp( -( x * x ) / ( 2 * ( conjugateStandardDeviation * conjugateStandardDeviation ) ) ) * sinCosTerm;

    dataSet.push( new Vector2( x, y ) );
  }
  return dataSet;
}

/**
 * Creates the data set for the waveform envelope. The provided data sets must describe the same wave packet -
 * one computed using sine, the other computed using cosine. They must have the same number of points,
 * and points with the same index must have the same x value.
 * This is based on the updateEnvelope method in D2CSumView.js.
 */
function createEnvelopeDataSet( dataSet1: Vector2[], dataSet2: Vector2[] ): Vector2[] {
  assert && assert( dataSet1.length > 0 );
  assert && assert( dataSet2.length > 0 );
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
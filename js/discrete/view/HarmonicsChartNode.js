// Copyright 2020, University of Colorado Boulder

//TODO move data set creation (especially sum data set) somewhere else
/**
 * HarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen. It renders a plot for each of
 * the harmonics in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import Property from '../../../../axon/js/Property.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from '../model/AxisDescription.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import SeriesType from '../model/SeriesType.js';
import DiscreteChartNode from './DiscreteChartNode.js';
import HarmonicPlot from './HarmonicPlot.js';

// constants

//TODO compute this dynamically, so that fewer points are needed as we zoom in.
// Number of points in the data set for each plot. This value was chosen empirically, such that the highest order
// harmonic looks smooth when the chart is fully zoomed out.
const POINTS_PER_PLOT = 2000;

const NORMAL_LINE_WIDTH = 1;
const EMPHASIZED_LINE_WIDTH = 2;
const DE_EMPHASIZED_LINE_WIDTH = 0.5;
const DE_EMPHASIZED_STROKE = Color.grayColor( 150 );

class HarmonicsChartNode extends DiscreteChartNode {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<number>} tProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {ObservableArrayDef} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( fourierSeries, tProperty, domainProperty, seriesTypeProperty, equationFormProperty,
               xZoomLevelProperty, xAxisDescriptionProperty, emphasizedHarmonics, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );
    assert && assert( xZoomLevelProperty instanceof NumberProperty, 'invalid xZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( fourierSeries, domainProperty, equationFormProperty, xZoomLevelProperty, xAxisDescriptionProperty, options );

    // @public {Property.<Vector2[]>} data set for the sum of the harmonics, drawn by the Sum chart
    this.sumDataSetProperty = new Property( [] );

    // {HarmonicPlot[]} a plot for each harmonic in the Fourier series, in harmonic order
    const harmonicPlots = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // Plot for this harmonic.
      const harmonicPlot = new HarmonicPlot( harmonic, this.chartTransform, [], {
        stroke: harmonic.colorProperty.value
      } );
      harmonicPlots.push( harmonicPlot );

      updateOneHarmonicPlot( harmonicPlot, this.chartTransform.modelXRange,
        fourierSeries.numberOfHarmonicsProperty.value, domainProperty.value, seriesTypeProperty.value,
        fourierSeries.L, fourierSeries.T, tProperty.value );
    }

    // Render all of the plots using Canvas, clipped to chartRectangle.
    // Reverse the order, so that the fundamental is in the foreground.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, harmonicPlots.slice().reverse(), {
      clipArea: this.chartRectangle.getShape()
    } );
    this.addChild( chartCanvasNode );

    // If any amplitude changes, redraw and update the sum.
    // unlink is not needed.
    harmonicPlots.forEach( plot => {
      plot.harmonic.amplitudeProperty.lazyLink( () => {
        updateOneHarmonicPlot( plot, this.chartTransform.modelXRange,
          fourierSeries.numberOfHarmonicsProperty.value, domainProperty.value, seriesTypeProperty.value,
          fourierSeries.L, fourierSeries.T, tProperty.value );
        chartCanvasNode.update();
        updateSumDataSet( this.sumDataSetProperty, harmonicPlots, fourierSeries.numberOfHarmonicsProperty.value );
      } );
    } );

    // Harmonic colors can be changed via fourier-making-waves-colors.html, or (perhaps in the future) via PHET-iO.
    // If that happens, update the plot stroke accordingly.
    // unlink is  not needed.
    harmonicPlots.forEach( plot => plot.harmonic.colorProperty.lazyLink( color => {
      plot.setStroke( color );
      chartCanvasNode.update();
    } ) );

    const updateEverything = () => {
      updateAllHarmonicPlots( chartCanvasNode, harmonicPlots, this.chartTransform.modelXRange,
        fourierSeries.numberOfHarmonicsProperty.value, domainProperty.value, seriesTypeProperty.value,
        fourierSeries.L, fourierSeries.T, tProperty.value );
      updateSumDataSet( this.sumDataSetProperty, harmonicPlots, fourierSeries.numberOfHarmonicsProperty.value );
    };

    // Initialize
    updateEverything();

    // unmultilink is not needed.
    Property.lazyMultilink( [ fourierSeries.numberOfHarmonicsProperty, domainProperty, seriesTypeProperty, tProperty ],
      updateEverything );

    // removeListener is not needed.
    this.chartTransform.changedEmitter.addListener( updateEverything );

    // Visually emphasize harmonics, see https://github.com/phetsims/fourier-making-waves/issues/31
    const emphasizedHarmonicsListener = () => {
      harmonicPlots.forEach( plot => {
        if ( emphasizedHarmonics.length === 0 ) {

          // no emphasis, all plots have their normal color and lineWidth
          plot.lineWidth = NORMAL_LINE_WIDTH;
          plot.setStroke( plot.harmonic.colorProperty.value );
        }
        else {

          // emphasize some plots, de-emphasize other plots
          if ( emphasizedHarmonics.includes( plot.harmonic ) ) {
            plot.lineWidth = EMPHASIZED_LINE_WIDTH;
            plot.setStroke( plot.harmonic.colorProperty.value );
          }
          else {
            plot.lineWidth = DE_EMPHASIZED_LINE_WIDTH;
            plot.setStroke( DE_EMPHASIZED_STROKE );
          }
        }
      } );
      chartCanvasNode.update();
    };
    emphasizedHarmonics.addItemAddedListener( emphasizedHarmonicsListener ); // removeItemAddedListener is not needed.
    emphasizedHarmonics.addItemRemovedListener( emphasizedHarmonicsListener ); // removeItemRemovedListener is not needed.
  }
}

/**
 * Updates one HarmonicPlot.
 * @param {HarmonicPlot} harmonicPlot
 * @param {Range} modelXRange
 * @param {number} numberOfHarmonics
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @param {number} L
 * @param {number} T
 * @param {number} t
 */
function updateOneHarmonicPlot( harmonicPlot, modelXRange, numberOfHarmonics, domain, seriesType, L, T, t ) {

  assert && assert( harmonicPlot instanceof HarmonicPlot, 'invalid harmonicPlot' );
  assert && assert( modelXRange instanceof Range, 'invalid modelXRange' );
  assert && AssertUtils.assertPositiveInteger( numberOfHarmonics );
  assert && assert( Domain.includes( domain ), 'invalid domain' );
  assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
  assert && AssertUtils.assertPositiveNumber( L );
  assert && AssertUtils.assertPositiveNumber( T );
  assert && assert( typeof t === 'number' && t >= 0, `invalid t: ${t}` );

  const harmonic = harmonicPlot.harmonic;
  const order = harmonic.order;
  const amplitude = harmonic.amplitudeProperty.value;

  //TODO https://github.com/phetsims/fourier-making-waves/issues/23 do we want to show 0 amplitudes? Java version does not.
  // Show plots for relevant harmonics with non-zero amplitude.
  harmonicPlot.visible = ( amplitude !== 0 ) && ( order <= numberOfHarmonics );

  if ( harmonic.order <= numberOfHarmonics ) {

    // Create the data set for a relevant harmonic.
    harmonicPlot.setDataSet( createHarmonicDataSet( order, amplitude, modelXRange, domain, seriesType, L, T, t ) );
  }
  else {

    // Empty an data set for a harmonic that is not relevant.
    harmonicPlot.setDataSet( [] );
  }
}

/**
 * Updates all HarmonicPlots.
 * @param {ChartCanvasNode} chartCanvasNode
 * @param {HarmonicPlot[]} harmonicPlots
 * @param {Range} modelXRange
 * @param {number} numberOfHarmonics
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @param {number} L
 * @param {number} T
 * @param {number} t
 */
function updateAllHarmonicPlots( chartCanvasNode, harmonicPlots, modelXRange, numberOfHarmonics, domain, seriesType, L, T, t ) {

  assert && assert( chartCanvasNode instanceof ChartCanvasNode, 'invalid chartCanvasNode' );
  // Other args are validated by updateOneHarmonicPlot

  for ( let i = 0; i < harmonicPlots.length; i++ ) {
    updateOneHarmonicPlot( harmonicPlots[ i ], modelXRange, numberOfHarmonics, domain, seriesType, L, T, t );
  }
  chartCanvasNode.update();
}

/**
 * Updates the data set for the sum.
 * @param {Property.<Vector2[]>} sumDataSetProperty
 * @param {HarmonicPlot[]} harmonicPlots
 * @param {number} numberOfHarmonics
 */
function updateSumDataSet( sumDataSetProperty, harmonicPlots, numberOfHarmonics ) {

  assert && AssertUtils.assertPropertyOf( sumDataSetProperty, Array );
  assert && AssertUtils.assertArrayOf( harmonicPlots, HarmonicPlot );
  assert && AssertUtils.assertPositiveInteger( numberOfHarmonics );

  const relevantHarmonicPlots = harmonicPlots.slice( 0, numberOfHarmonics );
  sumDataSetProperty.value = createSumDataSet( relevantHarmonicPlots );
}

/**
 * Creates the data set for a harmonic. This algorithm uses the equation that corresponds to EquationForm.MODE.
 * @param {number} order
 * @param {number} amplitude
 * @param {Range} xRange
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @param {number} L
 * @param {number} T
 * @param {number} t
 * @returns {Vector2[]}
 */
function createHarmonicDataSet( order, amplitude, xRange, domain, seriesType, L, T, t ) {

  assert && AssertUtils.assertPositiveInteger( order );
  assert && assert( typeof amplitude === 'number', 'invalid amplitude' );
  assert && assert( xRange instanceof Range, 'invalid xRange' );
  assert && assert( Domain.includes( domain ), 'invalid domain' );
  assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
  assert && AssertUtils.assertPositiveNumber( L );
  assert && AssertUtils.assertPositiveNumber( T );
  assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );

  const dx = xRange.getLength() / POINTS_PER_PLOT;

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

/**
 * Creates the data set for the sum of harmonics. This algorithm uses the equation that corresponds to EquationForm.MODE.
 * @param {HarmonicPlot[]} harmonicPlots
 * @returns {Vector2[]}
 */
function createSumDataSet( harmonicPlots ) {

  assert && AssertUtils.assertArrayOf( harmonicPlots, HarmonicPlot );
  assert && assert( harmonicPlots.length > 0, 'requires at least 1 plot' );

  const numberOfPoints = harmonicPlots[ 0 ].dataSet.length;
  assert && assert( _.every( harmonicPlots, plot => plot.dataSet.length === numberOfPoints ),
    'all data sets must have the same number of points' );

  // Sum the corresponding y values of all data sets.
  const sumDataSet = [];
  for ( let pointIndex = 0; pointIndex < numberOfPoints; pointIndex++ ) {
    let ySum = 0;
    const x0 = harmonicPlots[ 0 ].dataSet[ pointIndex ].x;
    for ( let plotIndex = 0; plotIndex < harmonicPlots.length; plotIndex++ ) {
      const point = harmonicPlots[ plotIndex ].dataSet[ pointIndex ];
      assert && assert( point.x === x0, `all data sets should have the same dx, ${point.x} !== ${x0}` );
      ySum += point.y;
    }
    sumDataSet.push( new Vector2( x0, ySum ) );
  }
  return sumDataSet;
}

fourierMakingWaves.register( 'HarmonicsChartNode', HarmonicsChartNode );
export default HarmonicsChartNode;
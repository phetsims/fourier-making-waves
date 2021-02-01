// Copyright 2020, University of Colorado Boulder

//TODO move data set creation (especially sum data set) somewhere else
/**
 * HarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen. It renders a plot for each of
 * the harmonics in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteChartsModel from '../model/DiscreteChartsModel.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';
import SeriesType from '../model/SeriesType.js';
import DiscreteChartNode from './DiscreteChartNode.js';
import HarmonicPlot from './HarmonicPlot.js';

// constants
const NORMAL_LINE_WIDTH = 1;
const EMPHASIZED_LINE_WIDTH = 2;
const DE_EMPHASIZED_LINE_WIDTH = 0.5;
const DE_EMPHASIZED_STROKE = Color.grayColor( 150 );

class HarmonicsChartNode extends DiscreteChartNode {

  /**
   * @param {DiscreteModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( model, options );

    // fields of interest in the model, to improve readability
    const fourierSeries = model.fourierSeries;
    const tProperty = model.tProperty;
    const domainProperty = model.domainProperty;
    const seriesTypeProperty = model.seriesTypeProperty;
    const emphasizedHarmonics = model.chartsModel.emphasizedHarmonics;
    const sumDataSetProperty = model.chartsModel.sumDataSetProperty;

    // {HarmonicPlot[]} a plot for each harmonic in the Fourier series, in harmonic order
    const harmonicPlots = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // Plot for this harmonic.
      const harmonicPlot = new HarmonicPlot( harmonic, this.chartTransform, [], {
        stroke: harmonic.colorProperty.value
      } );
      harmonicPlots.push( harmonicPlot );

      updateHarmonicPlot( harmonicPlot, this.chartTransform.modelXRange,
        fourierSeries.numberOfHarmonicsProperty.value, domainProperty.value, seriesTypeProperty.value,
        fourierSeries.L, fourierSeries.T, tProperty.value );
    }

    /**
     * Gets the harmonic data sets that are relevant, based on the number of harmonics in the Fourier series.
     * @returns {Array.<Array.<Vector2>>}
     */
    function getRelevantDataSets() {
      const plots = harmonicPlots.slice( 0, fourierSeries.numberOfHarmonicsProperty.value );
      return _.map( plots, plot => plot.dataSet );
    }

    // Render all of the plots using Canvas, clipped to chartRectangle.
    // Reverse the order, so that the fundamental is in the foreground.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, harmonicPlots.slice().reverse(), {
      clipArea: this.chartRectangle.getShape()
    } );
    this.addChild( chartCanvasNode );

    // If any amplitude changes, update the associated harmonic data set, and update the sum.
    // unlink is not needed.
    harmonicPlots.forEach( plot => {
      plot.harmonic.amplitudeProperty.lazyLink( () => {

        updateHarmonicPlot( plot, this.chartTransform.modelXRange,
          fourierSeries.numberOfHarmonicsProperty.value, domainProperty.value, seriesTypeProperty.value,
          fourierSeries.L, fourierSeries.T, tProperty.value );
        chartCanvasNode.update();

        sumDataSetProperty.value = DiscreteChartsModel.createSumDataSet( getRelevantDataSets() );
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

      for ( let i = 0; i < harmonicPlots.length; i++ ) {
        updateHarmonicPlot( harmonicPlots[ i ], this.chartTransform.modelXRange,
          fourierSeries.numberOfHarmonicsProperty.value, domainProperty.value, seriesTypeProperty.value,
          fourierSeries.L, fourierSeries.T, tProperty.value );
      }
      chartCanvasNode.update();

      sumDataSetProperty.value = DiscreteChartsModel.createSumDataSet( getRelevantDataSets() );
    };

    // Initialize
    updateEverything();

    // unmultilink is not needed.
    Property.lazyMultilink( [ fourierSeries.numberOfHarmonicsProperty, domainProperty, seriesTypeProperty, tProperty ],
      updateEverything );

    // removeListener is not needed.
    this.chartTransform.changedEmitter.addListener( updateEverything );

    // Visually emphasize harmonics, see https://github.com/phetsims/fourier-making-waves/issues/31
    const emphasizedHarmonicsChangedListener = () => {
      harmonicPlots.forEach( plot => {
        if ( emphasizedHarmonics.length === 0 ) {

          // no emphasis, all plots have their normal color and lineWidth
          plot.lineWidth = NORMAL_LINE_WIDTH;
          plot.setStroke( plot.harmonic.colorProperty.value );
        }
        else {

          // emphasize some plots, de-emphasize other plots
          if ( emphasizedHarmonics.includesHarmonic( plot.harmonic ) ) {
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
    emphasizedHarmonics.addChangedListener( emphasizedHarmonicsChangedListener ); // removeChangedListener is not needed
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
function updateHarmonicPlot( harmonicPlot, modelXRange, numberOfHarmonics, domain, seriesType, L, T, t ) {

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
    harmonicPlot.setDataSet( DiscreteChartsModel.createHarmonicDataSet( order, amplitude, modelXRange, domain, seriesType, L, T, t ) );
  }
  else {

    // Empty data set for a harmonic that is not relevant.
    harmonicPlot.setDataSet( [] );
  }
}

fourierMakingWaves.register( 'HarmonicsChartNode', HarmonicsChartNode );
export default HarmonicsChartNode;
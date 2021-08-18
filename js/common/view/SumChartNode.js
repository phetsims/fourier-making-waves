// Copyright 2020-2021, University of Colorado Boulder

/**
 * SumChartNode is the view base class for the 'Sum' chart, used in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColors from '../FMWColors.js';
import SumChart from '../model/SumChart.js';
import DomainChartNode from './DomainChartNode.js';

class SumChartNode extends DomainChartNode {

  /**
   * @param {SumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof SumChart );

    options = merge( {

      // SumChartNode options
      sumPlotStrokeProperty: FMWColors.sumPlotStrokeProperty,
      sumPlotLineWidth: 1
    }, options );

    // Fields of interest in sumChart, to improve readability
    const fourierSeries = sumChart.fourierSeries;
    const sumDataSetProperty = sumChart.sumDataSetProperty;
    const yAxisRangeProperty = sumChart.yAxisRangeProperty;

    super( sumChart, options );

    // Plot that shows the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, sumDataSetProperty.value, {
      stroke: options.sumPlotStrokeProperty.value,
      lineWidth: options.sumPlotLineWidth
    } );

    // Draw the sum plot using Canvas, clipped to chartRectangle.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // CanvasLinePlot does not allow stroke to be a Property, so we have to manage changes ourselves.
    options.sumPlotStrokeProperty.link( stroke => {
      sumPlot.stroke = stroke;
      chartCanvasNode.update();
    } );

    // Display the data set.
    sumDataSetProperty.lazyLink( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );

    // Hide the plot when the sum is zero (all amplitudes are zero)
    fourierSeries.amplitudesProperty.link( amplitudes => {
      sumPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );

    // Update the y-axis range.
    yAxisRangeProperty.link( range => this.chartTransform.setModelYRange( range ) );

    // @protected
    this.chartCanvasNode = chartCanvasNode;
    this.sumPlot = sumPlot;
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
export default SumChartNode;
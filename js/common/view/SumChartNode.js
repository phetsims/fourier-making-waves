// Copyright 2020-2021, University of Colorado Boulder

/**
 * SumChartNode is the view base class for the 'Sum' chart in the 'Discrete' and 'Wave Game' screens.
 * It creates and manages the plot for the sum of harmonics in a Fourier series.
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

    // Fields of interest in sumChart, to improve readability
    const amplitudesProperty = sumChart.fourierSeries.amplitudesProperty;
    const sumDataSetProperty = sumChart.sumDataSetProperty;
    const yAxisRangeProperty = sumChart.yAxisRangeProperty;
    const yAxisDescriptionProperty = sumChart.yAxisDescriptionProperty;

    options = merge( {

      // SumChartNode options.
      // Not using nested options for sumPlot here because CanvasLinePlot does not support Property for stroke.
      sumPlotStrokeProperty: FMWColors.sumPlotStrokeProperty,
      sumPlotLineWidth: 1,

      // FMWChartNode options
      chartTransformOptions: {
        // modelXRange is handled by superclass DomainChartNode
        modelYRange: yAxisDescriptionProperty.value.range
      }

    }, options );

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
    //REVIEW: This seems to be a common pattern with Data set Properties, any way to factor it out?
    sumDataSetProperty.lazyLink( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );

    // Hide the plot when the sum is zero (all amplitudes are zero)
    amplitudesProperty.link( amplitudes => {
      sumPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );

    // Update the y-axis range.
    yAxisRangeProperty.link( range => this.chartTransform.setModelYRange( range ) );

    // Update the y-axis decorations.
    yAxisDescriptionProperty.link( yAxisDescription => {
      // NOTE: this.chartTransform.setModelYRange is handled via yAxisRangeProperty listener, above.
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    // @protected
    this.chartCanvasNode = chartCanvasNode;
    this.sumPlot = sumPlot;
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
export default SumChartNode;
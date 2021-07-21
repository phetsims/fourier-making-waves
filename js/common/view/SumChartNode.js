// Copyright 2020-2021, University of Colorado Boulder

/**
 * SumChartNode is the view base class for the 'Sum' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColors from '../FMWColors.js';
import SumChart from '../model/SumChart.js';
import WaveformChartNode from './WaveformChartNode.js';
import ZoomLevelProperty from './ZoomLevelProperty.js';

class SumChartNode extends WaveformChartNode {

  /**
   * @param {SumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof SumChart );

    options = merge( {

      // SumChartNode options
      sumPlotStrokeProperty: FMWColors.sumStrokeProperty,
      sumPlotLineWidth: 1,

      // WaveformChartNode options
      xZoomLevelProperty: new ZoomLevelProperty( sumChart.xAxisDescriptionProperty ),
      yZoomLevelProperty: new ZoomLevelProperty( sumChart.yAxisDescriptionProperty )
    }, options );

    // Fields of interest in sumChart, to improve readability
    const fourierSeries = sumChart.fourierSeries;
    const sumDataSetProperty = sumChart.sumDataSetProperty;
    const yAutoScaleProperty = sumChart.yAutoScaleProperty;
    const yAxisAutoScaleRangeProperty = sumChart.yAxisAutoScaleRangeProperty;

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
    // unlink is not needed.
    options.sumPlotStrokeProperty.link( stroke => {
      sumPlot.stroke = stroke;
      chartCanvasNode.update();
    } );

    // unlink is not needed.
    sumDataSetProperty.lazyLink( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );

    // Hide the plot when the sum is zero (all amplitudes are zero)
    fourierSeries.amplitudesProperty.link( amplitudes => {
      sumPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );

    // Update the auto-scale range for the y-axis.
    Property.multilink(
      [ yAutoScaleProperty, yAxisAutoScaleRangeProperty ],
      ( yAutoScale, yAxisAutoScaleRange ) => {
        if ( yAutoScale ) {
          this.chartTransform.setModelYRange( yAxisAutoScaleRange );
        }
        else {
          // Do not setModelYRange when auto scale becomes false. We want the range to remain unchanged
          // until the user explicitly changes it via the y-axis zoom buttons.
        }
      } );

    // @protected
    this.chartCanvasNode = chartCanvasNode;
    this.sumPlot = sumPlot;
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
export default SumChartNode;
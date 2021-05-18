// Copyright 2021, University of Colorado Boulder

//TODO change this to display the sums for more than 1 FourierSeries?
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
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Waveform from '../../discrete/model/Waveform.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColorProfile from '../FMWColorProfile.js';
import SumChart from '../model/SumChart.js';
import TickLabelFormat from '../model/TickLabelFormat.js';
import WaveformChartNode from './WaveformChartNode.js';

class SumChartNode extends WaveformChartNode {

  /**
   * @param {SumChart} sumChart
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( sumChart, xAxisTickLabelFormatProperty, waveformProperty, options ) {

    assert && assert( sumChart instanceof SumChart );
    assert && AssertUtils.assertPropertyOf( xAxisTickLabelFormatProperty, TickLabelFormat );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );

    options = merge( {
      sumPlotStrokeProperty: FMWColorProfile.sumStrokeProperty,
      sumPlotLineWidth: 1,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Fields of interest in sumChart, to improve readability
    const fourierSeries = sumChart.fourierSeries;
    const domainProperty = sumChart.domainProperty;
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = sumChart.yAxisDescriptionProperty;
    const yAutoScaleProperty = sumChart.yAutoScaleProperty;
    const yAxisAutoScaleRangeProperty = sumChart.yAxisAutoScaleRangeProperty;
    const dataSetProperty = sumChart.dataSetProperty;

    super( fourierSeries.L, fourierSeries.T, domainProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty,
      yAxisDescriptionProperty, options );

    // Plot that shows the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, dataSetProperty.value, {
      stroke: options.sumPlotStrokeProperty.value,
      lineWidth: options.sumPlotLineWidth
    } );

    // Draw the sum plot using Canvas, clipped to chartRectangle.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // CanvasLinePlot does not allow stroke to be a Property, so we have to manage changes ourselves.
    // unlink in not needed.
    options.sumPlotStrokeProperty.link( stroke => {
      sumPlot.stroke = stroke;
      chartCanvasNode.update();
    } );

    // unlink is not needed.
    dataSetProperty.link( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );

    // Hide the plot when the sum is zero (all amplitudes are zero)
    fourierSeries.amplitudesProperty.link( amplitudes => {
      sumPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );

    //TODO move this to WaveformChartNode, add conditional for whether options.yAutoScaleProperty is defined
    // Update the y-axis. unlink is not needed.
    yAxisDescriptionProperty.link( yAxisDescription => {

      // Range is determined by yAxisDescription only if auto scale is disabled.
      if ( !yAutoScaleProperty.value ) {
        this.chartTransform.setModelYRange( yAxisDescription.range );
      }

      // Grid lines and tick marks are determined by AxisDescriptions regardless of whether auto scale is enabled.
      // This is because the model keeps AxisDescriptions in sync with yAxisAutoScaleRange.
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    //TODO move this to WaveformChartNode, add conditional for whether options.yAutoScaleProperty is defined
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
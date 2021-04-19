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
import SumChart from '../model/SumChart.js';
import FMWChartNode from './FMWChartNode.js';

class SumChartNode extends FMWChartNode {

  /**
   * @param {SumChart} sumChart
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( sumChart, xAxisTickLabelFormatProperty, waveformProperty, options ) {

    assert && assert( sumChart instanceof SumChart, 'invalid sumChart' );
    assert && assert( xAxisTickLabelFormatProperty instanceof Property, 'invalid xAxisTickLabelFormatProperty' );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );

    options = merge( {
      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Fields of interest in sumChart, to improve readability
    const fourierSeries = sumChart.fourierSeries;
    const domainProperty = sumChart.domainProperty;
    const xZoomLevelProperty = sumChart.xZoomLevelProperty;
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = sumChart.yAxisDescriptionProperty;
    const autoScaleProperty = sumChart.autoScaleProperty;
    const sumDataSetProperty = sumChart.sumDataSetProperty;

    super( fourierSeries.L, fourierSeries.T, domainProperty, xZoomLevelProperty, xAxisDescriptionProperty,
      xAxisTickLabelFormatProperty, options );

    // Plot that shows the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, sumDataSetProperty.value, {
      stroke: 'black'
    } );

    // Draw the sum plot using Canvas, clipped to chartRectangle.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // unlink is not needed.
    sumDataSetProperty.link( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );

    // Hide the plot when the sum is zero (all amplitudes are zero)
    fourierSeries.amplitudesProperty.link( amplitudes => {
      sumPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );

    // Update the y-axis. unlink is not needed.
    yAxisDescriptionProperty.link( yAxisDescription => {

      // Range is determined by zoom level only if auto scale is disabled.
      if ( !autoScaleProperty.value ) {
        this.chartTransform.setModelYRange( yAxisDescription.range );
      }

      // Grid lines and tick marks are determined by zoom level regardless of whether auto scale is enabled.
      // This is because the model keep the zoom level in sync with yAxisAutoScaleRange.
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
export default SumChartNode;
// Copyright 2020, University of Colorado Boulder

//TODO change this to display the sums for more than 1 FourierSeries?
/**
 * SumChartNode displays the 'Sum' chart in the 'Discrete' screen. It renders 1 plot showing the sum of the harmonics
 * in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import SumChart from '../model/SumChart.js';
import Waveform from '../model/Waveform.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import DiscreteChartNode from './DiscreteChartNode.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';

class SumChartNode extends DiscreteChartNode {

  /**
   * @param {SumChart} sumChart
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Object} [options]
   */
  constructor( sumChart, waveformProperty, xAxisTickLabelFormatProperty, options ) {

    assert && assert( sumChart instanceof SumChart, 'invalid sumChart' );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && assert( xAxisTickLabelFormatProperty instanceof Property, 'invalid xAxisTickLabelFormatProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Fields of interest in sumChart, to improve readability
    const fourierSeries = sumChart.fourierSeries;
    const domainProperty = sumChart.domainProperty;
    const xZoomLevelProperty = sumChart.xZoomLevelProperty;
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;
    const yZoomLevelProperty = sumChart.yZoomLevelProperty;
    const yAxisDescriptionProperty = sumChart.yAxisDescriptionProperty;
    const autoScaleProperty = sumChart.autoScaleProperty;
    const yAxisAutoScaleRangeProperty = sumChart.yAxisAutoScaleRangeProperty;
    const infiniteHarmonicsVisibleProperty = sumChart.infiniteHarmonicsVisibleProperty;
    const sumDataSetProperty = sumChart.sumDataSetProperty;

    super( fourierSeries.L, fourierSeries.T, domainProperty, xZoomLevelProperty, xAxisDescriptionProperty,
      xAxisTickLabelFormatProperty, options );

    // Zoom buttons for the y-axis range
    const yZoomButtonGroup = new PlusMinusZoomButtonGroup( yZoomLevelProperty, {
      orientation: 'vertical',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5,
      right: this.chartRectangle.left - 31, // determined empirically
      top: this.chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'yZoomButtonGroup' )
    } );
    this.addChild( yZoomButtonGroup );

    // Shows the wave that the Fourier series is attempting to approximate
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty, {
      listener: () => {
        //TODO
      },
      tandem: options.tandem.createTandem( 'infiniteHarmonicsCheckbox' )
    } );

    // Disable infiniteHarmonicsCheckbox for custom and wave-packet waveforms. unlink is not needed.
    waveformProperty.link( waveform => {

      //TODO move right-hand side expression into Waveform?
      infiniteHarmonicsCheckbox.enabled = ( waveform !== Waveform.CUSTOM && waveform !== Waveform.WAVE_PACKET );
    } );

    // Automatically scales the y axis to show the entire plot
    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty, {
      tandem: options.tandem.createTandem( 'autoScaleCheckbox' )
    } );

    const checkboxesParent = new HBox( {
      spacing: 25,
      children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ],
      left: this.chartRectangle.left,
      top: this.xTickLabels.bottom + 5
    } );
    this.addChild( checkboxesParent );

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

    // Disable the y-axis zoom buttons when auto scale is enabled. unlink is not needed.
    autoScaleProperty.link( autoScale => {
      yZoomButtonGroup.enabled = !autoScale;
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

    // Update the auto-scale range for the y-axis.
    Property.multilink(
      [ autoScaleProperty, yAxisAutoScaleRangeProperty ],
      ( autoScale, yAxisAutoScaleRange ) => {
        if ( autoScale ) {
          this.chartTransform.setModelYRange( yAxisAutoScaleRange );
        }
        else {
          // Do not setModelYRange when auto scale becomes false. We want the range to remain unchanged
          // until the user explicitly changes it via the y-axis zoom buttons.
        }
      } );
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
export default SumChartNode;
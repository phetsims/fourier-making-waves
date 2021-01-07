// Copyright 2020, University of Colorado Boulder

/**
 * SumChartNode displays the 'Sum' chart in the 'Discrete' screen. It renders 1 plot showing the sum of the harmonics
 * in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Waveform from '../model/Waveform.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import DiscreteChartNode from './DiscreteChartNode.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';

class SumChartNode extends DiscreteChartNode {

  /**
   * @param {DiscreteModel} model
   * @param {Property.<Vector2[]>} sumDataSetProperty
   * @param {Object} [options]
   */
  constructor( model, sumDataSetProperty, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && AssertUtils.assertPropertyOf( sumDataSetProperty, Array );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( model, options );

    // fields of interest in the model, to improve readability
    const waveformProperty = model.waveformProperty;
    const yZoomLevelProperty = model.chartsModel.yZoomLevelProperty;
    const yAxisDescriptionProperty = model.chartsModel.yAxisDescriptionProperty;
    const autoScaleProperty = model.chartsModel.autoScaleProperty;
    const infiniteHarmonicsVisibleProperty = model.chartsModel.infiniteHarmonicsVisibleProperty;

    // Zoom buttons for the y-axis range
    const yZoomButtonGroup = new PlusMinusZoomButtonGroup( yZoomLevelProperty, {
      orientation: 'vertical',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      right: this.chartRectangle.left - 31, // determined empirically
      top: this.chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'yZoomButtonGroup' )
    } );
    this.addChild( yZoomButtonGroup );

    // unlink is not needed.
    yAxisDescriptionProperty.link( yAxisDescription => {
      this.chartTransform.setModelYRange( new Range( -yAxisDescription.max, yAxisDescription.max ) );
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    // Shows the wave that the Fourier series is attempting to approximate
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty, {
      listener: () => {
        //TODO
      },
      tandem: options.tandem.createTandem( 'infiniteHarmonicsCheckbox' )
    } );

    // Disable infiniteHarmonicsCheckbox for custom waveform. unlink is not needed.
    waveformProperty.link( waveform => {
      infiniteHarmonicsCheckbox.enabled = ( waveform !== Waveform.CUSTOM );
    } );

    // Automatically scales the y axis to show the entire plot
    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty, {
      listener: () => {
        //TODO
      },
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
      clipArea: this.chartRectangle.getShape()
    } );
    this.addChild( chartCanvasNode );

    // unlink is not needed.
    sumDataSetProperty.link( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
export default SumChartNode;
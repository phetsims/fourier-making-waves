// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen. It adds zoom buttons for the x and y axes,
 * and checkboxes for 'auto scale' and 'infinite harmonics'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteSumChart from '../model/DiscreteSumChart.js';
import Waveform from '../model/Waveform.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';

class DiscreteSumChartNode extends SumChartNode {

  /**
   * @param {DiscreteSumChart} sumChart
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( sumChart, xAxisTickLabelFormatProperty, waveformProperty, options ) {

    assert && assert( sumChart instanceof DiscreteSumChart );

    super( sumChart, xAxisTickLabelFormatProperty, waveformProperty, options );

    // Fields of interest in sumChart, to improve readability
    const xZoomLevelProperty = sumChart.xZoomLevelProperty;
    const yZoomLevelProperty = sumChart.yZoomLevelProperty;
    const yAutoScaleProperty = sumChart.yAutoScaleProperty;
    const infiniteHarmonicsVisibleProperty = sumChart.infiniteHarmonicsVisibleProperty;

    // Zoom buttons for the x-axis range, at bottom right.
    const xZoomButtonGroup = new PlusMinusZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      touchAreaXDilation: 5,
      touchAreaYDilation: 10,
      left: this.chartRectangle.right + 6,
      bottom: this.chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
    } );
    this.addChild( xZoomButtonGroup );

    // Zoom buttons for the y-axis range, at bottom left.
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

    // Disable the y-axis zoom buttons when auto scale is enabled. unlink is not needed.
    yAutoScaleProperty.link( yAutoScale => {
      yZoomButtonGroup.enabled = !yAutoScale;
    } );
    yZoomButtonGroup.enabledProperty.link( () => yZoomButtonGroup.interruptSubtreeInput() );

    // Automatically scales the y axis to show the entire plot
    const autoScaleCheckbox = new AutoScaleCheckbox( yAutoScaleProperty, {
      tandem: options.tandem.createTandem( 'autoScaleCheckbox' )
    } );

    // Shows the wave that the Fourier series is attempting to approximate
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty, {
      listener: () => {
        //TODO
      },
      tandem: options.tandem.createTandem( 'infiniteHarmonicsCheckbox' )
    } );

    // Disable infiniteHarmonicsCheckbox for custom and wave-packet waveforms. unlink is not needed.
    waveformProperty.link( waveform => {
      infiniteHarmonicsCheckbox.enabled = ( waveform !== Waveform.CUSTOM && waveform !== Waveform.WAVE_PACKET );
    } );
    infiniteHarmonicsCheckbox.enabledProperty.link( () => infiniteHarmonicsCheckbox.interruptSubtreeInput() );

    // Group the checkboxes at the lower-left of the chart's rectangle.
    const checkboxesParent = new HBox( {
      spacing: 25,
      children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ],
      left: this.chartRectangle.left,
      top: this.xTickLabels.bottom + 5
    } );
    this.addChild( checkboxesParent );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'DiscreteSumChartNode', DiscreteSumChartNode );
export default DiscreteSumChartNode;
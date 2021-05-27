// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen. It adds zoom buttons for the x and y axes,
 * and checkboxes for 'auto scale' and 'infinite harmonics'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteSumChart from '../model/DiscreteSumChart.js';
import Waveform from '../model/Waveform.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';
import InfiniteHarmonicsPlot from './InfiniteHarmonicsPlot.js';

class DiscreteSumChartNode extends SumChartNode {

  /**
   * @param {DiscreteSumChart} sumChart
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( sumChart, waveformProperty, options ) {

    assert && assert( sumChart instanceof DiscreteSumChart );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );

    super( sumChart, options );

    // Fields of interest in sumChart, to improve readability
    const yAutoScaleProperty = sumChart.yAutoScaleProperty;
    const infiniteHarmonicsVisibleProperty = sumChart.infiniteHarmonicsVisibleProperty;

    // Plot for the 'Infinite Harmonics' feature
    const infiniteHarmonicsPlot = new InfiniteHarmonicsPlot( this.chartTransform,
      sumChart.infiniteHarmonicsDataSetProperty, infiniteHarmonicsVisibleProperty );

    // When anything about the plot changes, update the associated ChartCanvasNode.
    infiniteHarmonicsPlot.changedEmitter.addListener( () => this.chartCanvasNode.update() );

    // Put the infiniteHarmonicsPlot behind plots that were added by the superclass.
    this.chartCanvasNode.setPainters( [ infiniteHarmonicsPlot, ...this.chartCanvasNode.painters ] );

    // Disable the y-axis zoom buttons when auto scale is enabled. unlink is not needed.
    if ( this.yZoomButtonGroup ) {
      yAutoScaleProperty.link( yAutoScale => {
        this.yZoomButtonGroup.enabled = !yAutoScale;
      } );
      this.yZoomButtonGroup.enabledProperty.link( () => this.yZoomButtonGroup.interruptSubtreeInput() );
    }

    // Automatically scales the y axis to show the entire plot
    const autoScaleCheckbox = new AutoScaleCheckbox( yAutoScaleProperty, {
      tandem: options.tandem.createTandem( 'autoScaleCheckbox' )
    } );

    // Shows the wave that the Fourier series is attempting to approximate
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty, {
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
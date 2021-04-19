// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HBox from '../../../../scenery/js/nodes/HBox.js';
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
    const autoScaleProperty = sumChart.autoScaleProperty;
    const infiniteHarmonicsVisibleProperty = sumChart.infiniteHarmonicsVisibleProperty;

    // Automatically scales the y axis to show the entire plot
    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty, {
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

      //TODO move right-hand side expression into Waveform?
      infiniteHarmonicsCheckbox.enabled = ( waveform !== Waveform.CUSTOM && waveform !== Waveform.WAVE_PACKET );
    } );

    // Group the checkboxes at the lower-right of the chart's rectangle.
    const checkboxesParent = new HBox( {
      spacing: 25,
      children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ],
      left: this.chartRectangle.left,
      top: this.xTickLabels.bottom + 5
    } );
    this.addChild( checkboxesParent );
  }
}

fourierMakingWaves.register( 'DiscreteSumChartNode', DiscreteSumChartNode );
export default DiscreteSumChartNode;
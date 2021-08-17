// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen. It adds zoom buttons for the x and y axes,
 * and checkboxes for 'auto scale' and 'infinite harmonics'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteSumChart from '../model/DiscreteSumChart.js';
import Waveform from '../model/Waveform.js';
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

    options = merge( {

      // WaveformChartNode options
      xZoomLevelProperty: new ZoomLevelProperty( sumChart.xAxisDescriptionProperty )
    }, options );

    super( sumChart, options );

    // Fields of interest in sumChart, to improve readability
    const infiniteHarmonicsVisibleProperty = sumChart.infiniteHarmonicsVisibleProperty;

    // Plot for the 'Infinite Harmonics' feature
    const infiniteHarmonicsPlot = new InfiniteHarmonicsPlot( this.chartTransform,
      sumChart.infiniteHarmonicsDataSetProperty, infiniteHarmonicsVisibleProperty );

    // When anything about the plot changes, update the associated ChartCanvasNode.
    infiniteHarmonicsPlot.changedEmitter.addListener( () => this.chartCanvasNode.update() );

    // Put the infiniteHarmonicsPlot behind plots that were added by the superclass.
    this.chartCanvasNode.setPainters( [ infiniteHarmonicsPlot, ...this.chartCanvasNode.painters ] );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'DiscreteSumChartNode', DiscreteSumChartNode );
export default DiscreteSumChartNode;
// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen. It adds x-axis zoom buttons and an
 * 'Infinite Harmonics' checkbox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteSumChart from '../model/DiscreteSumChart.js';
import Waveform from '../model/Waveform.js';
import InfiniteHarmonicsPlot from './InfiniteHarmonicsPlot.js';

// constants
const X_TICK_LABEL_DECIMALS = 2;
const Y_TICK_LABEL_DECIMALS = 1;

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

      // DomainChartNode options
      xZoomLevelProperty: new ZoomLevelProperty( sumChart.xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value =>
          TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS, sumChart.xAxisTickLabelFormatProperty.value,
            sumChart.domainProperty.value, sumChart.fourierSeries.L, sumChart.fourierSeries.T )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
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

    // x-axis tick labels are specific to domain and format (numeric vs symbolic).
    // This causes options.xLabelSetOptions.createLabels to be called.
    Property.multilink( [ sumChart.domainProperty, sumChart.xAxisTickLabelFormatProperty ],
      () => this.xTickLabels.invalidateLabelSet()
    );
  }
}

fourierMakingWaves.register( 'DiscreteSumChartNode', DiscreteSumChartNode );
export default DiscreteSumChartNode;
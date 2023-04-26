// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen. It extends SumChartNode by handling the
 * view responsibilities for things that were added to DiscreteSumChart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteSumChart from '../model/DiscreteSumChart.js';
import InfiniteHarmonicsPlot from './InfiniteHarmonicsPlot.js';

// constants
const X_TICK_LABEL_DECIMALS = 2;
const Y_TICK_LABEL_DECIMALS = 1;

export default class DiscreteSumChartNode extends SumChartNode {

  /**
   * @param {DiscreteSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof DiscreteSumChart );
    assert && assert( options && options.tandem );

    options = merge( {

      // DomainChartNode options
      xZoomLevelProperty: new ZoomLevelProperty( sumChart.xAxisDescriptionProperty, options.tandem.createTandem( 'xZoomLevelProperty' ) ),
      xTickLabelSetOptions: {
        createLabel: value =>
          TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS, sumChart.xAxisTickLabelFormatProperty.value,
            sumChart.domainProperty.value, sumChart.fourierSeries.L, sumChart.fourierSeries.T )
      },
      yTickLabelSetOptions: {
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

    // x-axis tick labels are specific to Domain and format (numeric vs symbolic).
    // This causes options.xTickLabelSetOptions.createLabels to be called.
    Multilink.multilink( [ sumChart.domainProperty, sumChart.xAxisTickLabelFormatProperty ],
      () => this.xTickLabels.invalidateTickLabelSet()
    );
  }
}

fourierMakingWaves.register( 'DiscreteSumChartNode', DiscreteSumChartNode );
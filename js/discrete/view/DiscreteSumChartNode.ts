// Copyright 2021-2024, University of Colorado Boulder

/**
 * DiscreteSumChartNode displays the 'Sum' chart in the 'Discrete' screen. It extends SumChartNode by handling the
 * view responsibilities for things that were added to DiscreteSumChart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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

  public constructor( sumChart: DiscreteSumChart, tandem: Tandem ) {

    const options = {

      // SumChartNodeOptions
      xZoomLevelProperty: new ZoomLevelProperty( sumChart.xAxisDescriptionProperty, tandem.createTandem( 'xZoomLevelProperty' ) ),
      xTickLabelSetOptions: {
        cachingEnabled: false, // see https://github.com/phetsims/bamboo/issues/65
        createLabel: ( value: number ) =>
          TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS, sumChart.xAxisTickLabelFormatProperty.value,
            sumChart.domainProperty.value, sumChart.fourierSeries.L, sumChart.fourierSeries.T )
      },
      yTickLabelSetOptions: {
        createLabel: ( value: number ) => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      },
      tandem: tandem
    };

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

    // x-axis tick labels are specific to Domain and format (numeric vs symbolic).
    // This causes options.xTickLabelSetOptions.createLabels to be called.
    Multilink.multilink( [ sumChart.domainProperty, sumChart.xAxisTickLabelFormatProperty ],
      () => this.xTickLabels.invalidateTickLabelSet()
    );
  }
}

fourierMakingWaves.register( 'DiscreteSumChartNode', DiscreteSumChartNode );
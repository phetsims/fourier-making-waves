// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteHarmonicsChart from '../model/DiscreteHarmonicsChart.js';

// constants
const X_TICK_LABEL_DECIMALS = 2;
const Y_TICK_LABEL_DECIMALS = 1;

class DiscreteHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {DiscreteHarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {

    assert && assert( harmonicsChart instanceof DiscreteHarmonicsChart );

    options = merge( {

      // WaveformChartNode options
      xZoomLevelProperty: new ZoomLevelProperty( harmonicsChart.xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value =>
          TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS, harmonicsChart.xAxisTickLabelFormatProperty.value,
            harmonicsChart.domainProperty.value, harmonicsChart.fourierSeries.L, harmonicsChart.fourierSeries.T )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( harmonicsChart, options );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );

    // x-axis tick labels are specific to domain and format (numeric vs symbolic).
    // This causes options.xLabelSetOptions.createLabels to be called.
    Property.multilink( [ harmonicsChart.domainProperty, harmonicsChart.xAxisTickLabelFormatProperty ],
      () => this.xTickLabels.invalidateLabelSet()
    );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChartNode', DiscreteHarmonicsChartNode );
export default DiscreteHarmonicsChartNode;
// Copyright 2021-2024, University of Colorado Boulder

/**
 * DiscreteHarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen. It extends HarmonicsChartNode
 * by handling the view responsibilities for things that were added to DiscreteHarmonicsChart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteHarmonicsChart from '../model/DiscreteHarmonicsChart.js';

// constants
const X_TICK_LABEL_DECIMALS = 2;
const Y_TICK_LABEL_DECIMALS = 1;

export default class DiscreteHarmonicsChartNode extends HarmonicsChartNode {

  public constructor( harmonicsChart: DiscreteHarmonicsChart, tandem: Tandem ) {

    super( harmonicsChart, {

      // HarmonicsChartNodeOptions
      xZoomLevelProperty: new ZoomLevelProperty( harmonicsChart.xAxisDescriptionProperty, tandem.createTandem( 'xZoomLevelProperty' ) ),
      xTickLabelSetOptions: {
        cachingEnabled: false, // see https://github.com/phetsims/bamboo/issues/65
        createLabel: value =>
          TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS, harmonicsChart.xAxisTickLabelFormatProperty.value,
            harmonicsChart.domainProperty.value, harmonicsChart.fourierSeries.L, harmonicsChart.fourierSeries.T )
      },
      yTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      },
      tandem: tandem
    } );

    // x-axis tick labels are specific to Domain and format (numeric vs symbolic).
    // This causes options.xTickLabelSetOptions.createLabels to be called.
    Multilink.multilink( [ harmonicsChart.domainProperty, harmonicsChart.xAxisTickLabelFormatProperty ],
      () => this.xTickLabels.invalidateTickLabelSet()
    );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChartNode', DiscreteHarmonicsChartNode );
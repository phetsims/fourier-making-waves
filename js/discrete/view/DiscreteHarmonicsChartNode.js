// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteHarmonicsChart from '../model/DiscreteHarmonicsChart.js';

class DiscreteHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {DiscreteHarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {

    assert && assert( harmonicsChart instanceof DiscreteHarmonicsChart );

    options = merge( {

      // WaveformChartNode options
      xZoomLevelProperty: new ZoomLevelProperty( harmonicsChart.xAxisDescriptionProperty )
    }, options );

    super( harmonicsChart, options );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChartNode', DiscreteHarmonicsChartNode );
export default DiscreteHarmonicsChartNode;
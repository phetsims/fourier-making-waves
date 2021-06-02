// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousSumChartNode is the 'Sum' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

//TODO placeholder
class ContinuousSumChartNode extends Rectangle {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      //TODO delete these?
      stroke: 'black',
      fill: 'white'
    }, options );

    super( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, options );
  }
}

fourierMakingWaves.register( 'ContinuousSumChartNode', ContinuousSumChartNode );
export default ContinuousSumChartNode;
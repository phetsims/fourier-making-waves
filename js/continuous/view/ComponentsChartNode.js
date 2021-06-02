// Copyright 2021, University of Colorado Boulder

/**
 * ComponentsChartNode is the 'Components' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

//TODO placeholder
class ComponentsChartNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, options );

    //TODO placeholder
    const rectangle = new Rectangle( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, {
      stroke: 'black',
      fill: 'white'
    } );

    assert && assert( !options.children );
    options.children = [ rectangle ];

    super( options );
  }
}

fourierMakingWaves.register( 'ComponentsChartNode', ComponentsChartNode );
export default ComponentsChartNode;
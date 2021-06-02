// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousSumChartNode is the 'Sum' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import EnvelopeCheckbox from './EnvelopeCheckbox.js';

//TODO placeholder
class ContinuousSumChartNode extends Node {

  /**
   * @param {Property.<boolean>} envelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( envelopeVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( envelopeVisibleProperty, 'boolean' );

    options = merge( {}, options );

    //TODO placeholder
    const rectangle = new Rectangle( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, {
      stroke: 'black',
      fill: 'white'
    } );

    const envelopeCheckbox = new EnvelopeCheckbox( envelopeVisibleProperty, {
      right: rectangle.right,
      top: rectangle.bottom + 5
    } );

    assert && assert( !options.children );
    options.children = [ rectangle, envelopeCheckbox ];

    super( options );
  }
}

fourierMakingWaves.register( 'ContinuousSumChartNode', ContinuousSumChartNode );
export default ContinuousSumChartNode;
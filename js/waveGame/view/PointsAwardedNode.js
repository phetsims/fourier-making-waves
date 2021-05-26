// Copyright 2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class PointsAwardedNode extends HBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      points: 1,
      spacing: 25
    }, options );
    assert && AssertUtils.assertPositiveInteger( options.points );

    const pointsNode = new Text( `+${options.points}`, {
      font: new PhetFont( 200 ),
      fill: 'black'
    } );

    const starNode = new StarNode( {
      value: 1,
      scale: 6
    } );

    assert && assert( !options.children, 'PointsAwardedNode sets children' );
    options.children = [ pointsNode, starNode ];

    super( options );

    // @private
    this.pointsNode = pointsNode;
  }

  /**
   * Sets the number of points displayed.
   * @param {number} points
   * @public
   */
  setPoints( points ) {
    assert && AssertUtils.assertPositiveInteger( points );
    this.pointsNode.text = `+${points}`;
  }
}

fourierMakingWaves.register( 'PointsAwardedNode', PointsAwardedNode );
export default PointsAwardedNode;
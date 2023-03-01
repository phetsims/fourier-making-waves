// Copyright 2021-2023, University of Colorado Boulder

/**
 * PointsAwardedNode shows the number of points awarded when the user solves a challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class PointsAwardedNode extends HBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // PointsAwardedNode options
      points: 1,

      // HBox options
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
    this.pointsNode = pointsNode; // {Text}
  }

  /**
   * Sets the number of points displayed.
   * @param {number} points
   * @public
   */
  setPoints( points ) {
    assert && AssertUtils.assertPositiveInteger( points );
    this.pointsNode.string = `+${points}`;
  }
}

fourierMakingWaves.register( 'PointsAwardedNode', PointsAwardedNode );
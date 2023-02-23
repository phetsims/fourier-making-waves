// Copyright 2021-2023, University of Colorado Boulder

/**
 * HorizontalDimensionalArrowsNode draws horizontal dimensions arrows, like this: |<---->|
 *
 * Note that we cannot use ArrowNode because it does not support lineDash.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Line, Node, Path } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class HorizontalDimensionalArrowsNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      x1: 0,
      x2: 100,
      color: 'black',
      horizontalLineWidth: 2,
      verticalLineWidth: 2,
      verticalLineLength: 14,
      arrowHeadDimensions: new Dimension2( 8, 8 )
    }, options );

    // horizontal dashed line in center
    const horizontalLine = new Line( options.x1, 0, options.x2, 0, {
      stroke: options.color,
      lineWidth: options.horizontalLineWidth,
      lineDash: options.horizontalLineDash
    } );

    // vertical solid line at left end
    const leftVerticalLine = new Line( 0, 0, 0, options.verticalLineLength, {
      stroke: options.color,
      lineWidth: options.verticalLineWidth
    } );

    // vertical solid line at right end
    const rightVerticalLine = new Line( 0, 0, 0, options.verticalLineLength, {
      stroke: options.color,
      lineWidth: options.verticalLineWidth
    } );

    // arrow head that points left
    const leftArrowHeadShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( options.arrowHeadDimensions.width, -options.arrowHeadDimensions.height / 2 ),
      new Vector2( options.arrowHeadDimensions.width, options.arrowHeadDimensions.height / 2 )
    ] );
    const leftArrowHead = new Path( leftArrowHeadShape, {
      fill: options.color
    } );

    // arrow head that points right
    const rightArrowHeadShape = leftArrowHeadShape.transformed( Matrix3.scaling( -1, 1 ) );
    const rightArrowHead = new Path( rightArrowHeadShape, {
      fill: options.color
    } );

    assert && assert( !options.children, 'HorizontalDimensionalArrowsNode sets children' );
    options = merge( {
      children: [ horizontalLine, leftVerticalLine, rightVerticalLine, leftArrowHead, rightArrowHead ]
    }, options );

    super( options );

    // Position all of the subcomponents relative to the horizontalLine, since it's the component that changes.
    horizontalLine.boundsProperty.link( bounds => {

      // If the arrow heads overlap, place them on the outside (pointing in) and hide the horizontal line.
      const arrowsOverlap = ( bounds.width < ( leftArrowHead.width + rightArrowHead.width + 5 ) );
      horizontalLine.visible = !arrowsOverlap;
      leftArrowHead.left = arrowsOverlap ? bounds.right : bounds.left;
      rightArrowHead.right = arrowsOverlap ? bounds.left : bounds.right;

      // Vertical lines at the ends of the horizontal line.
      leftVerticalLine.centerX = bounds.left;
      rightVerticalLine.centerX = bounds.right;

      // Vertically center everything on the horizontal line.
      leftVerticalLine.centerY = bounds.centerY;
      leftArrowHead.centerY = bounds.centerY;
      rightVerticalLine.centerY = bounds.centerY;
      rightArrowHead.centerY = bounds.centerY;
    } );

    // @private
    this.horizontalLine = horizontalLine; // {Line}
  }

  /**
   * Sets the line coordinates.
   * @param {number} x1
   * @param {number} x2
   * @public
   */
  setLine( x1, x2 ) {
    this.horizontalLine.setLine( x1, 0, x2, 0 );
  }
}

fourierMakingWaves.register( 'HorizontalDimensionalArrowsNode', HorizontalDimensionalArrowsNode );
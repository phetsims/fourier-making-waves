// Copyright 2021-2023, University of Colorado Boulder

/**
 * HorizontalDimensionalArrowsNode draws horizontal dimensions arrows, like this: |<---->|
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Line, Node, Path, TColor } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const HORIZONTAL_LINE_WIDTH = 2;
const VERTICAL_LINE_WIDTH = 2;
const VERTICAL_LINE_LENGTH = 14;
const ARROW_HEAD_DIMENSIONS = new Dimension2( 8, 8 );

export default class HorizontalDimensionalArrowsNode extends Node {

  private readonly horizontalLine: Line;

  public constructor( color: TColor ) {

    // horizontal dashed line in center, arbitrary initial coordinates
    const horizontalLine = new Line( 0, 0, 1, 0, {
      stroke: color,
      lineWidth: HORIZONTAL_LINE_WIDTH
    } );

    // vertical solid line at left end
    const leftVerticalLine = new Line( 0, 0, 0, VERTICAL_LINE_LENGTH, {
      stroke: color,
      lineWidth: VERTICAL_LINE_WIDTH
    } );

    // vertical solid line at right end
    const rightVerticalLine = new Line( 0, 0, 0, VERTICAL_LINE_LENGTH, {
      stroke: color,
      lineWidth: VERTICAL_LINE_WIDTH
    } );

    // arrow head that points left
    const leftArrowHeadShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( ARROW_HEAD_DIMENSIONS.width, -ARROW_HEAD_DIMENSIONS.height / 2 ),
      new Vector2( ARROW_HEAD_DIMENSIONS.width, ARROW_HEAD_DIMENSIONS.height / 2 )
    ] );
    const leftArrowHead = new Path( leftArrowHeadShape, {
      fill: color
    } );

    // arrow head that points right
    const rightArrowHeadShape = leftArrowHeadShape.transformed( Matrix3.scaling( -1, 1 ) );
    const rightArrowHead = new Path( rightArrowHeadShape, {
      fill: color
    } );

    super( {
      children: [ horizontalLine, leftVerticalLine, rightVerticalLine, leftArrowHead, rightArrowHead ]
    } );

    // Position all subcomponents relative to the horizontalLine, since it's the subcomponent that changes.
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

    this.horizontalLine = horizontalLine;
  }

  /**
   * Sets the line coordinates.
   */
  public setLine( x1: number, x2: number ): void {
    this.horizontalLine.setLine( x1, 0, x2, 0 );
  }
}

fourierMakingWaves.register( 'HorizontalDimensionalArrowsNode', HorizontalDimensionalArrowsNode );
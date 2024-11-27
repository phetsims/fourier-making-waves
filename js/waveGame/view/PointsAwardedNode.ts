// Copyright 2021-2023, University of Colorado Boulder

/**
 * PointsAwardedNode shows the number of points awarded when the user solves a challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import { HBox, HBoxOptions, Text } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

type SelfOptions = {
  points?: number;
};

type PointsAwardedNodeOptions = SelfOptions &
  PickOptional<HBoxOptions, 'phetioReadOnly' | 'visible'> &
  PickRequired<HBoxOptions, 'tandem'>;

export default class PointsAwardedNode extends HBox {

  private readonly pointsText: Text;

  public constructor( providedOptions: PointsAwardedNodeOptions ) {

    const options = optionize<PointsAwardedNodeOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      points: 1,

      // HBoxOptions
      spacing: 25
    }, providedOptions );

    assert && assert( Number.isInteger( options.points ) && options.points > 0 );

    const pointsText = new Text( `+${options.points}`, {
      font: new PhetFont( 200 ),
      fill: 'black'
    } );

    const starNode = new StarNode( {
      value: 1,
      scale: 6
    } );

    options.children = [ pointsText, starNode ];

    super( options );

    this.pointsText = pointsText;
  }

  /**
   * Sets the number of points displayed.
   */
  public setPoints( points: number ): void {
    assert && assert( Number.isInteger( points ) && points > 0 );
    this.pointsText.string = `+${points}`;
  }
}

fourierMakingWaves.register( 'PointsAwardedNode', PointsAwardedNode );
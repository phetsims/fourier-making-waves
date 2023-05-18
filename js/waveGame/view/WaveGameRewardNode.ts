// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameRewardNode is the reward that's shown behind the RewardDialog when the user reaches the score
 * that results in a reward. This is a bunch of smiley faces and stars that fall from the top of the screen.
 * See design decisions in https://github.com/phetsims/fourier-making-waves/issues/50.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import RewardNode from '../../../../vegas/js/RewardNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const NUMBER_OF_NODES = 100;

const NODES = [
  new FaceNode( 40, { headStroke: 'black' } ),
  new StarNode()
];

export default class WaveGameRewardNode extends RewardNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, options );

    assert && assert( !options.children, 'WaveGameRewardNode sets nodes' );
    options.nodes = RewardNode.createRandomNodes( NODES, NUMBER_OF_NODES );

    super( options );
  }
}

fourierMakingWaves.register( 'WaveGameRewardNode', WaveGameRewardNode );
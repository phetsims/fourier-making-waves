// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameRewardNode is the reward that's shown behind the RewardDialog when the user reaches the score
 * that results in a reward.
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

//TODO different Nodes for each level?
const NODES = [
  new FaceNode( 40, { headStroke: 'black' } ),
  new StarNode()
];

class WaveGameRewardNode extends RewardNode {

  /**
   * @param {number} level
   * @param {Object} [options]
   */
  constructor( level, options ) {

    options = merge( {
      //TODO
    }, options );

    assert && assert( !options.children, 'WaveGameRewardNode sets nodes' );
    options.nodes = RewardNode.createRandomNodes( NODES, NUMBER_OF_NODES );

    super( options );
  }
}

fourierMakingWaves.register( 'WaveGameRewardNode', WaveGameRewardNode );
export default WaveGameRewardNode;
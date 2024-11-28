// Copyright 2021-2024, University of Colorado Boulder

/**
 * WaveGameRewardNode is the reward that's shown behind the RewardDialog when the user reaches the score
 * that results in a reward. This is a bunch of smiley faces and stars that fall from the top of the screen.
 * See design decisions in https://github.com/phetsims/fourier-making-waves/issues/50.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import RewardNode, { RewardNodeOptions } from '../../../../vegas/js/RewardNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const NUMBER_OF_NODES = 100;

const NODES = [
  new FaceNode( 40, { headStroke: 'black' } ),
  new StarNode()
];

type SelfOptions = EmptySelfOptions;

type WaveGameRewardNodeOptions = SelfOptions & PickRequired<RewardNodeOptions, 'tandem' | 'visible'>;

export default class WaveGameRewardNode extends RewardNode {

  public constructor( providedOptions: WaveGameRewardNodeOptions ) {

    const options = optionize<WaveGameRewardNodeOptions, SelfOptions, RewardNodeOptions>()( {

      // RewardNodeOptions
      nodes: RewardNode.createRandomNodes( NODES, NUMBER_OF_NODES ),
      phetioReadOnly: true
    }, providedOptions );

    super( options );
  }
}

fourierMakingWaves.register( 'WaveGameRewardNode', WaveGameRewardNode );
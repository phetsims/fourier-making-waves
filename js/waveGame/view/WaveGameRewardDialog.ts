// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameRewardDialog is the reward dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

export default class WaveGameRewardDialog extends RewardDialog {

  public constructor( levelProperty: Property<WaveGameLevel | null>, rewardNode: WaveGameRewardNode,
                      rewardScore: number, tandem: Tandem ) {

    assert && assert( Number.isInteger( rewardScore ) && rewardScore > 0 );

    super( rewardScore, {

      // 'Keep Going' hides the dialog, but doesn't change the current challenge.
      keepGoingButtonListener: () => this.hide(),

      // 'New Level' pre-loads a new challenge for the current level, then takes us back to the level-selection interface.
      newLevelButtonListener: () => {
        this.hide();
        const level = levelProperty.value!;
        assert && assert( level );
        level.newWaveform();
        levelProperty.value = null; // back to the level-selection UI
      },

      // When the dialog is shown, show the reward.
      showCallback: () => {
        rewardNode.visible = true;
      },

      // When the dialog is hidden, hide the reward.
      hideCallback: () => {
        rewardNode.visible = false;
      },

      // phet-io options
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}

fourierMakingWaves.register( 'WaveGameRewardDialog', WaveGameRewardDialog );
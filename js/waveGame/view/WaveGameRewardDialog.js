// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameRewardDialog is the reward dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';

class WaveGameRewardDialog extends RewardDialog {

  /**
   * @param {Property.<null|WaveGameLevel>} levelProperty
   * @param {WaveGameRewardNode} rewardNode
   * @param {Object} [options]
   */
  constructor( levelProperty, rewardNode, options ) {

    assert && assert( levelProperty instanceof Property );
    assert && assert( rewardNode instanceof WaveGameRewardNode );

    options = merge( {

      // 'Keep Going' hides the dialog, but doesn't change the current challenge.
      keepGoingButtonListener: () => this.hide(),

      // 'New Level' pre-loads a new challenge for the current level, then takes us back to the level-selection interface.
      newLevelButtonListener: () => {
        this.hide();
        levelProperty.value.newWaveform();
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
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true
    }, options );

    super( FMWConstants.REWARD_SCORE, options );
  }
}

fourierMakingWaves.register( 'WaveGameRewardDialog', WaveGameRewardDialog );
export default WaveGameRewardDialog;
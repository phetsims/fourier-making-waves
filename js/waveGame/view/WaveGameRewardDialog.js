// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameRewardDialog is the reward dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';

export default class WaveGameRewardDialog extends RewardDialog {

  /**
   * @param {Property.<null|WaveGameLevel>} levelProperty
   * @param {WaveGameRewardNode} rewardNode
   * @param {number} rewardScore
   * @param {Object} [options]
   */
  constructor( levelProperty, rewardNode, rewardScore, options ) {

    assert && assert( levelProperty instanceof Property );
    assert && assert( rewardNode instanceof WaveGameRewardNode );
    assert && AssertUtils.assertPositiveInteger( rewardScore );

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

    super( rewardScore, options );
  }
}

fourierMakingWaves.register( 'WaveGameRewardDialog', WaveGameRewardDialog );
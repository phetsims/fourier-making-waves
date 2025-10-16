// Copyright 2021-2025, University of Colorado Boulder

/**
 * WaveGameRewardDialog is the reward dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from '../model/WaveGameLevel.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';

export default class WaveGameRewardDialog extends RewardDialog {

  public constructor( levelProperty: Property<WaveGameLevel | null>, rewardNode: WaveGameRewardNode,
                      rewardScore: number, tandem: Tandem ) {

    assert && assert( Number.isInteger( rewardScore ) && rewardScore > 0 );

    // The level number presented by the RewardDialog. Must be disposed.
    const levelNumberProperty = new DerivedProperty( [ levelProperty ], level => {
      return level ? level.levelNumber : 0;
    } );

    super( levelNumberProperty, rewardScore, {

      // 'Keep Going' hides the dialog, but doesn't change the current challenge.
      dismissListener: () => this.hide(),

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

    this.addDisposable( levelNumberProperty );
  }
}

fourierMakingWaves.register( 'WaveGameRewardDialog', WaveGameRewardDialog );
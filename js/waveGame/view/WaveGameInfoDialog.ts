// Copyright 2021-2024, University of Colorado Boulder

/**
 * WaveGameInfoDialog describes the game levels in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameInfoDialog from '../../../../vegas/js/GameInfoDialog.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

export default class WaveGameInfoDialog extends GameInfoDialog {

  public constructor( levels: WaveGameLevel[], tandem: Tandem ) {

    const titleText = new Text( FourierMakingWavesStrings.levelsStringProperty, {
      font: new PhetFont( 32 )
    } );

    const descriptions = levels.map( level => level.infoDialogDescriptionStringProperty );

    super( descriptions, {

      // GameInfoDialogOptions
      isDisposable: false,
      title: titleText,
      gameLevels: FMWQueryParameters.gameLevels,
      ySpacing: 20,
      bottomMargin: 20,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}

fourierMakingWaves.register( 'WaveGameInfoDialog', WaveGameInfoDialog );
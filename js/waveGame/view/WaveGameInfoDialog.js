// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveGameInfoDialog describes the game levels in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameInfoDialog from '../../../../vegas/js/GameInfoDialog.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

const MAX_CONTENT_WIDTH = 600;

class WaveGameInfoDialog extends GameInfoDialog {

  /**
   * @param {WaveGameLevel[]} levels
   * @param {Object} [options]
   */
  constructor( levels, options ) {

    options = merge( {

      // GameInfoDialogOptions
      gameLevels: FMWQueryParameters.gameLevels,
      descriptionTextOptions: {
        font: new PhetFont( 24 )
      },
      vBoxOptions: {
        align: 'left',
        spacing: 20,
        maxWidth: MAX_CONTENT_WIDTH // scale all descriptions uniformly
      },
      ySpacing: 20,
      bottomMargin: 20,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true
    }, options );

    assert && assert( !options.title, 'WaveGameInfoDialog sets title' );
    options.title = new Text( fourierMakingWavesStrings.levels, {
      font: new PhetFont( 32 ),
      maxWidth: 0.75 * MAX_CONTENT_WIDTH,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    super( levels.map( level => level.infoDialogDescription ), options );
  }
}

fourierMakingWaves.register( 'WaveGameInfoDialog', WaveGameInfoDialog );
export default WaveGameInfoDialog;
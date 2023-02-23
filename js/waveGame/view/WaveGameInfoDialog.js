// Copyright 2021-2023, University of Colorado Boulder

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
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class WaveGameInfoDialog extends GameInfoDialog {

  /**
   * @param {WaveGameLevel[]} levels
   * @param {Object} [options]
   */
  constructor( levels, options ) {

    options = merge( {
      gameLevels: FMWQueryParameters.gameLevels,
      ySpacing: 20,
      bottomMargin: 20,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true
    }, options );

    assert && assert( !options.title, 'WaveGameInfoDialog sets title' );
    options.title = new Text( FourierMakingWavesStrings.levelsStringProperty, {
      font: new PhetFont( 32 ),
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const descriptions = levels.map( level => level.infoDialogDescriptionProperty );

    super( descriptions, options );
  }
}

fourierMakingWaves.register( 'WaveGameInfoDialog', WaveGameInfoDialog );
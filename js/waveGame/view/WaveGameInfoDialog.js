// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameInfoDialog is the Info dialog that describes the game levels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants
const MAX_CONTENT_WIDTH = 600;
const LEVEL_INFO_FONT = new PhetFont( 24 );

class WaveGameInfoDialog extends Dialog {

  /**
   * @param {WaveGameLevel[]} levels
   * @param {Object} [options]
   */
  constructor( levels, options ) {

    options = merge( {

      // Dialog options
      ySpacing: 20,
      bottomMargin: 20,

      // phet-io
      phetioReadOnly: true
    }, options );

    assert && assert( !options.title, 'WaveGameInfoDialog sets title' );
    options.title = new Text( fourierMakingWavesStrings.levels, {
      font: new PhetFont( 32 ),
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    const children = levels.map( level => new LevelInfoText( level.levelNumber, level.infoDialogDescription ) );

    // Hide info for levels that are not included in gameLevels query parameter.
    // We must still create these Nodes so that we don't risk changing the PhET-iO API.
    if ( FMWQueryParameters.gameLevels ) {
      children.forEach( node => {
        node.visible = FMWQueryParameters.gameLevels.includes( node.levelNumber );
      } );
    }

    const content = new VBox( {
      align: 'left',
      spacing: 20,
      children: children,
      maxWidth: MAX_CONTENT_WIDTH // scale all of the descriptions uniformly
    } );

    super( content, options );
  }
}

class LevelInfoText extends RichText {
  constructor( levelNumber, description ) {
    super( description, {
      font: LEVEL_INFO_FONT
    } );
    this.levelNumber = levelNumber; // @public
  }
}

fourierMakingWaves.register( 'WaveGameInfoDialog', WaveGameInfoDialog );
export default WaveGameInfoDialog;
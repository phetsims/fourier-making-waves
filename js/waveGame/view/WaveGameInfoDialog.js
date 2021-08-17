// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameInfoDialog is the Info dialog that describes the game levels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants
const MAX_CONTENT_WIDTH = 600;

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

    const children = [];
    levels.forEach( level =>
      children.push( new RichText( level.infoDialogDescription, {
        font: new PhetFont( 24 )
      } ) )
    );

    const content = new VBox( {
      align: 'left',
      spacing: 20,
      children: children,
      maxWidth: MAX_CONTENT_WIDTH // scale all of the descriptions uniformly
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'WaveGameInfoDialog', WaveGameInfoDialog );
export default WaveGameInfoDialog;
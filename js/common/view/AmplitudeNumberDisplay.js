// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';

// constants
const DEFAULT_FONT = new PhetFont( 12 );

class AmplitudeNumberDisplay extends VBox {

  /**
   * @param {Harmonic} harmonic
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog
   * @param {Object} [options]
   */
  constructor( harmonic, amplitudeKeypadDialog, options ) {

    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog, 'invalid amplitudeKeypadDialog' );

    options = merge( {

      cursor: 'pointer',

      // VBox options
      spacing: FMWConstants.AMPLITUDE_DECIMAL_PLACES,
      align: 'center',

      // NumberDisplay options
      numberDisplayOptions: {
        align: 'center',
        decimalPlaces: 2,
        textOptions: {
          font: DEFAULT_FONT
        }
      }
    }, options );

    const labelNode = new RichText( StringUtils.fillIn( fourierMakingWavesStrings.amplitudeSymbolOrder, {
      symbol: FMWSymbols.CAPITAL_A,
      order: harmonic.order
    } ), {
      font: DEFAULT_FONT
    } );

    const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, harmonic.amplitudeProperty.range,
      options.numberDisplayOptions );

    assert && assert( !options.children, 'NAME sets children' );
    options.children = [ labelNode, numberDisplay ];

    super( options );

    this.addInputListener( new PressListener( {
      press: () => {
        const restoreBackgroundFill = numberDisplay.getBackgroundFill();
        numberDisplay.setBackgroundFill( PhetColorScheme.BUTTON_YELLOW );
        amplitudeKeypadDialog.clearKeypad();
        amplitudeKeypadDialog.setOrder( harmonic.order );
        amplitudeKeypadDialog.show();

        // Update the harmonic's amplitude when the dialog is closed, and remove this listener.
        const isShowingListener = isShowing => {
          assert && assert( !isShowing, 'unexpected isShowing value' );
          numberDisplay.setBackgroundFill( restoreBackgroundFill );
          const keypadValue = amplitudeKeypadDialog.getKeypadValue();
          if ( keypadValue !== null ) {
            harmonic.amplitudeProperty.value = keypadValue;
          }
          amplitudeKeypadDialog.isShowingProperty.unlink( isShowingListener );
        };
        amplitudeKeypadDialog.isShowingProperty.lazyLink( isShowingListener );
      }
    } ) );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'AmplitudeNumberDisplay', AmplitudeNumberDisplay );
export default AmplitudeNumberDisplay;
// Copyright 2020-2021, University of Colorado Boulder

/**
 * AmplitudeNumberDisplay is a specialization of NumberDisplay that displays the value of a harmonic's amplitude.
 * Clicking on it opens an AmplitudeKeypadDialog, where the user can enter an amplitude value using a keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

class AmplitudeNumberDisplay extends VBox {

  /**
   * @param {Harmonic} harmonic
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog
   * @param {Object} [options]
   */
  constructor( harmonic, emphasizedHarmonics, amplitudeKeypadDialog, options ) {

    assert && assert( harmonic instanceof Harmonic );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog );

    options = merge( {

      // AmplitudeNumberDisplay options
      // {function} called when there's a press anywhere on this Node
      press: _.noop,

      // VBox options
      cursor: 'pointer',
      spacing: 2,
      align: 'center',

      // NumberDisplay options
      numberDisplayOptions: {
        align: 'center',
        decimalPlaces: FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES,
        textOptions: {
          font: DEFAULT_FONT
        }
      }
    }, options );

    const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, harmonic.amplitudeProperty.range,
      options.numberDisplayOptions );

    const labelNode = new RichText( `${FMWSymbols.A}<sub>${harmonic.order}</sub>`, {
      font: DEFAULT_FONT,
      maxWidth: numberDisplay.width
    } );

    assert && assert( !options.children, 'NAME sets children' );
    options.children = [ labelNode, numberDisplay ];

    super( options );

    const pressListener = new PressListener( {
      press: () => {

        // We have started editing
        options.press();

        // Change the background fill to indicate which amplitude we're editing.
        const restoreBackgroundFill = numberDisplay.getBackgroundFill();
        numberDisplay.setBackgroundFill( PhetColorScheme.BUTTON_YELLOW );

        // Emphasize the associated harmonic.
        emphasizedHarmonics.push( amplitudeKeypadDialog, harmonic );

        // Open the keypad dialog.
        amplitudeKeypadDialog.show( harmonic.order,

          // enterCallback, called when the keypad's Enter key fires.
          amplitude => { harmonic.amplitudeProperty.value = amplitude; },

          // closeCallback, called when the dialog is closed.
          () => {
            numberDisplay.setBackgroundFill( restoreBackgroundFill );

            // De-emphasize the associated harmonic.
            if ( emphasizedHarmonics.includesNode( amplitudeKeypadDialog ) ) {
              emphasizedHarmonics.remove( amplitudeKeypadDialog );
            }
          }
        );
      },
      tandem: options.tandem.createTandem( 'pressListener' )
    } );
    this.addInputListener( pressListener );

    // Emphasize the associated harmonic.
    pressListener.isHighlightedProperty.link( isHighlighted => {
      if ( isHighlighted ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesNode( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );
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
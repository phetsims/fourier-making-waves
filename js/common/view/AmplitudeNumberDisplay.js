// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudeNumberDisplay is a specialization of NumberDisplay that displays the value of a harmonic's amplitude.
 * Clicking on it opens a keypad dialog, which can be used to enter an amplitude value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import PresetFunction from '../../discrete/model/PresetFunction.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';

// constants
const DEFAULT_FONT = new PhetFont( 12 );

class AmplitudeNumberDisplay extends VBox {

  /**
   * @param {Harmonic} harmonic
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog
   * @param {EnumerationProperty.<PresetFunction>} presetFunctionProperty
   * @param {Object} [options]
   */
  constructor( harmonic, amplitudeKeypadDialog, presetFunctionProperty, options ) {

    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog, 'invalid amplitudeKeypadDialog' );
    assert && AssertUtils.assertEnumerationPropertyOf( presetFunctionProperty, PresetFunction );

    options = merge( {

      cursor: 'pointer',

      // VBox options
      spacing: 2,
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

    const labelNode = new RichText( `${FMWSymbols.A}<sub>${harmonic.order}</sub>`, {
      font: DEFAULT_FONT
    } );

    const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, harmonic.amplitudeProperty.range,
      options.numberDisplayOptions );

    assert && assert( !options.children, 'NAME sets children' );
    options.children = [ labelNode, numberDisplay ];

    super( options );

    this.addInputListener( new PressListener( {
      press: () => {

        // When we edit an amplitude, switch to custom.
        presetFunctionProperty.value = PresetFunction.CUSTOM;

        // Change the background fill to indicate which amplitude we're editing.
        const restoreBackgroundFill = numberDisplay.getBackgroundFill();
        numberDisplay.setBackgroundFill( PhetColorScheme.BUTTON_YELLOW );

        // Open the keypad dialog.
        amplitudeKeypadDialog.show( harmonic.order,

          // enterCallback, called when the keypad's Enter key fires.
          amplitude => { harmonic.amplitudeProperty.value = amplitude; },

          // closeCallback, called when the dialog is closed.
          () => numberDisplay.setBackgroundFill( restoreBackgroundFill )
        );
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
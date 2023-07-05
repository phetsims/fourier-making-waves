// Copyright 2020-2023, University of Colorado Boulder

/**
 * AmplitudeNumberDisplay is a specialization of NumberDisplay that displays the value of a harmonic's amplitude.
 * Clicking on it opens an AmplitudeKeypadDialog, where the user can enter an amplitude value using a keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { InteractiveHighlighting, NodeTranslationOptions, PressListener, RichText, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWQueryParameters from '../FMWQueryParameters.js';
import FMWSymbols from '../FMWSymbols.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

type SelfOptions = {
  press?: () => void; // called when there's a press anywhere on this Node
  numberDisplayOptions?: StrictOmit<NumberDisplayOptions, 'tandem'>;
};

export type AmplitudeNumberDisplayOptions = SelfOptions & NodeTranslationOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class AmplitudeNumberDisplay extends InteractiveHighlighting( VBox ) {

  public constructor( harmonic: Harmonic, emphasizedHarmonics: EmphasizedHarmonics,
                      amplitudeKeypadDialog: AmplitudeKeypadDialog, providedOptions: AmplitudeNumberDisplayOptions ) {

    const options = optionize<AmplitudeNumberDisplayOptions, SelfOptions, VBoxOptions>()( {

      // SelfOptions
      press: _.noop,
      numberDisplayOptions: {
        align: 'center',
        decimalPlaces: FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES,
        textOptions: {
          font: DEFAULT_FONT
        }
      },

      // VBoxOptions
      isDisposable: false,
      cursor: 'pointer',
      spacing: 2,
      align: 'center',
      tagName: 'button', // must be an HTML5 tagName that supports click events
      focusable: FMWQueryParameters.focusableAmplitudeNumberDisplay
    }, providedOptions );

    const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, harmonic.amplitudeProperty.range,
      options.numberDisplayOptions );

    const labelStringProperty = new DerivedStringProperty(
      [ FMWSymbols.AMarkupStringProperty ],
      A => `${A}<sub>${harmonic.order}</sub>`, {
        tandem: Tandem.OPT_OUT
      } );

    const labelNode = new RichText( labelStringProperty, {
      font: DEFAULT_FONT,
      maxWidth: numberDisplay.width
    } );

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
        amplitudeKeypadDialog.showAmplitudeKeypadDialog( harmonic.order,

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
      tandem: options.tandem.createTandem( 'pressListener' ),
      phetioEnabledPropertyInstrumented: true
    } );
    this.addInputListener( pressListener );

    // Whether this associated harmonic is emphasized.
    const isEmphasizedProperty = DerivedProperty.or( [ pressListener.isHighlightedProperty, pressListener.isFocusedProperty ] );

    // Emphasize the associated harmonic.
    isEmphasizedProperty.link( isEmphasized => {
      if ( isEmphasized ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesNode( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );
  }
}

fourierMakingWaves.register( 'AmplitudeNumberDisplay', AmplitudeNumberDisplay );
// Copyright 2020-2023, University of Colorado Boulder

/**
 * AmplitudeNumberDisplay is a specialization of NumberDisplay that displays the value of a harmonic's amplitude.
 * Clicking on it opens an AmplitudeKeypadDialog, where the user can enter an amplitude value using a keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { InteractiveHighlighting, PressListener, RichText, VBox } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWQueryParameters from '../FMWQueryParameters.js';
import FMWSymbols from '../FMWSymbols.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

export default class AmplitudeNumberDisplay extends InteractiveHighlighting( VBox ) {

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
      },

      // pdom
      tagName: 'button', // must be an HTML5 tagName that supports click events
      focusable: FMWQueryParameters.focusableAmplitudeNumberDisplay
    }, options );

    const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, harmonic.amplitudeProperty.range,
      options.numberDisplayOptions );

    const labelString = new DerivedProperty( [ FMWSymbols.AStringProperty ],
      A => `${A}<sub>${harmonic.order}</sub>` );

    const labelNode = new RichText( labelString, {
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
// Copyright 2020-2025, University of Colorado Boulder

/**
 * AmplitudeKeypadDialog is a Dialog that provides a keypad for entering an amplitude value.
 * Pressing the Enter button calls options.enterCallback, provided by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';

// constants
const TITLE_FONT = new PhetFont( 18 );
const BUTTON_FONT = new PhetFont( 16 );
const VALUE_FONT = new PhetFont( 14 );
const VALID_VALUE_FILL = 'black';
const INVALID_VALUE_FILL = 'red';
const KEYPAD_DISPLAY_FONT = new PhetFont( 12 );

type SelfOptions = {
  decimalPlaces?: number; // Number of decimal places that can be entered for values, a non-negative integer.
};

type AmplitudeKeypadDialogOptions = SelfOptions & PickRequired<DialogOptions, 'tandem' | 'layoutBounds'>;

type EnterCallback = ( amplitude: number ) => void;
type CloseCallback = () => void;

export default class AmplitudeKeypadDialog extends Dialog {

  private readonly keypad: Keypad;
  private readonly titleNode: RichText;
  private readonly orderProperty: NumberProperty;

  // called when the Enter button fires
  private enterCallback: EnterCallback | null;

  // called when the dialog has been closed
  private closeCallback: CloseCallback | null;

  public constructor( amplitudeRange: Range, providedOptions: AmplitudeKeypadDialogOptions ) {

    const options = optionize<AmplitudeKeypadDialogOptions, SelfOptions, DialogOptions>()( {

      // SelfOptions
      decimalPlaces: FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES,

      // DialogOptions
      isDisposable: false,
      closeButtonLength: 12,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,
      layoutStrategy: ( dialog: Dialog, simBounds: Bounds2, screenBounds: Bounds2, scale: number ) => {
        const layoutBounds = dialog.layoutBounds!;
        assert && assert( layoutBounds );

        // a little below center, so that it does not overlap the Amplitudes chart
        dialog.centerX = layoutBounds.centerX;
        dialog.centerY = layoutBounds.centerY + 50;
      },
      phetioReadOnly: true
    }, providedOptions );

    assert && assert( Number.isInteger( options.decimalPlaces ) && options.decimalPlaces >= 0,
      `decimal places must be a non-negative integer: ${options.decimalPlaces}` );

    // Compute the maximum number of digits that can be entered on the keypad.
    const maxDigits = Math.max(
      Utils.toFixed( amplitudeRange.min, options.decimalPlaces ).replace( /[^0-9]/g, '' ).length,
      Utils.toFixed( amplitudeRange.max, options.decimalPlaces ).replace( /[^0-9]/g, '' ).length
    );

    const keypad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
      accumulatorOptions: {
        maxDigits: maxDigits,
        maxDigitsRightOfMantissa: options.decimalPlaces
      },
      buttonWidth: 25,
      buttonHeight: 25,
      buttonFont: BUTTON_FONT,
      tandem: Tandem.OPT_OUT // unnecessary to instrument
    } );

    const orderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      isValidValue: value => ( value > 0 )
    } );

    // Title indicates which amplitude we're editing, e.g. A<sub>2</sub>.
    const titleStringProperty = new DerivedStringProperty(
      [ FMWSymbols.AMarkupStringProperty, orderProperty ],
      ( A, order ) => `${A}<sub>${order}</sub>`, {
        tandem: Tandem.OPT_OUT
      } );
    const titleNode = new RichText( titleStringProperty, {
      font: TITLE_FONT,
      maxWidth: keypad.width
    } );

    // Range of valid values is shown
    const rangeStringProperty = new PatternStringProperty( FourierMakingWavesStrings.minToMaxStringProperty, {
      min: Utils.toFixedNumber( amplitudeRange.min, options.decimalPlaces ),
      max: Utils.toFixedNumber( amplitudeRange.max, options.decimalPlaces )
    }, {
      tandem: Tandem.OPT_OUT
    } );
    const rangeNode = new Text( rangeStringProperty, {
      font: VALUE_FONT,
      maxWidth: keypad.width
    } );

    // Displays what has been entered on the keypad. We cannot use NumberDisplay because it displays numbers,
    // and is not capable of displaying partial numeric input like '1.'
    const stringDisplay = new KeypadStringDisplay( keypad.stringProperty, {
      width: keypad.width,
      height: 28, // determined empirically
      rectangleOptions: {
        cornerRadius: 2
      },
      textOptions: {
        font: VALUE_FONT
      }
    } );

    // Enter button, processes what has been entered on the keypad
    const enterButton = new RectangularPushButton( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      content: new Text( FourierMakingWavesStrings.enterStringProperty, {
        font: BUTTON_FONT,
        maxWidth: keypad.width
      } ),
      tandem: options.tandem.createTandem( 'enterButton' )
    } );

    // Vertical layout
    const content = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ titleNode, rangeNode, stringDisplay, keypad, enterButton ]
    } );

    super( content, options );

    this.keypad = keypad;
    this.titleNode = titleNode;
    this.orderProperty = orderProperty;
    this.enterCallback = null;
    this.closeCallback = null;

    // When the Enter button fires...
    enterButton.addListener( () => {
      const value = this.keypad.valueProperty.value;
      if ( value === null ) {

        // Nothing was entered, so do nothing.
      }
      else if ( amplitudeRange.contains( value ) ) {

        // A valid value was entered. Provide the value to the client and close the dialog.
        this.enterCallback && this.enterCallback( value );
        this.hide();
      }
      else {

        // An invalid value was entered, indicate by highlighting the value and range.
        stringDisplay.setTextFill( INVALID_VALUE_FILL );
        rangeNode.fill = INVALID_VALUE_FILL;
      }
    } );

    // When any key is pressed, restore colors.
    keypad.accumulatedKeysProperty.link( () => {
      stringDisplay.setTextFill( VALID_VALUE_FILL );
      rangeNode.fill = VALID_VALUE_FILL;
    } );
  }

  /**
   * Shows the dialog.
   * @param order - the order of the harmonic
   * @param enterCallback - called when the Enter button fires
   * @param closeCallback - called when the dialog has been closed
   */
  public showAmplitudeKeypadDialog( order: number, enterCallback: EnterCallback, closeCallback: CloseCallback ): void {
    assert && assert( Number.isInteger( order ) && order > 0 );

    this.orderProperty.value = order; // causes titleNode to update
    this.enterCallback = enterCallback;
    this.closeCallback = closeCallback;
    this.keypad.clear();

    super.show();
  }

  /**
   * Hides the dialog.
   */
  public override hide(): void {
    super.hide();
    this.closeCallback && this.closeCallback();
    this.enterCallback = null;
    this.closeCallback = null;
    this.keypad.clear();
  }
}

/**
 * KeypadStringDisplay displays a Keypad's stringProperty value, showing what keys the user has 'typed'.
 */

type KeypadStringDisplaySelfOptions = {
  width?: number;
  height?: number;
  xMargin?: number;
  yMargin?: number;
  stringFormat?: ( value: string ) => string;
  rectangleOptions?: StrictOmit<RectangleOptions, 'tandem'>;
  textOptions?: StrictOmit<RichTextOptions, 'tandem'>;
};

type KeypadStringDisplayOptions = KeypadStringDisplaySelfOptions;

class KeypadStringDisplay extends Node {

  private readonly textNode: RichText;

  public constructor( stringProperty: TReadOnlyProperty<string>, providedOptions?: KeypadStringDisplayOptions ) {

    const options = optionize<KeypadStringDisplayOptions, KeypadStringDisplaySelfOptions, NodeOptions>()( {

      // SelfOptions
      width: 100,
      height: 50,
      xMargin: 0,
      yMargin: 0,
      stringFormat: ( value: string ) => value,
      rectangleOptions: {
        cornerRadius: 0,
        fill: 'white',
        stroke: 'black'
      },
      textOptions: {
        fill: 'black',
        font: KEYPAD_DISPLAY_FONT
      },

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    const rectangle = new Rectangle( 0, 0, options.width, options.height, options.rectangleOptions );

    const textNode = new RichText( '', combineOptions<RichTextOptions>( {
      maxWidth: rectangle.width - 2 * options.xMargin,
      maxHeight: rectangle.height - 2 * options.yMargin
    }, options.textOptions ) );

    options.children = [ rectangle, textNode ];

    super( options );

    // Display the string value. unlink is required on dispose.
    const stringListener = ( string: string ) => {
      textNode.string = options.stringFormat( string );
    };
    stringProperty.link( stringListener );

    // Keep the text centered in the background. unlink is not required.
    textNode.boundsProperty.link( () => {
      textNode.center = rectangle.center;
    } );

    this.textNode = textNode;
  }

  /**
   * Sets the fill for the text.
   */
  public setTextFill( fill: TPaint ): void {
    this.textNode.fill = fill;
  }
}

fourierMakingWaves.register( 'AmplitudeKeypadDialog', AmplitudeKeypadDialog );
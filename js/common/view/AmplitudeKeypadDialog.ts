// Copyright 2020-2023, University of Colorado Boulder

/**
 * AmplitudeKeypadDialog is a Dialog that provides a keypad for entering an amplitude value.
 * Pressing the Enter button calls options.enterCallback, provided by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
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
const ALIGN_VALUE_VALUES = [ 'left', 'center', 'right' ];

export default class AmplitudeKeypadDialog extends Dialog {

  /**
   * @param {Range} amplitudeRange
   * @param {Object} [options]
   */
  constructor( amplitudeRange, options ) {

    assert && assert( amplitudeRange instanceof Range );

    options = merge( {

      // Number of decimal places that can be entered for values.
      decimalPlaces: FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES,

      // Dialog options
      closeButtonLength: 12,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,
      layoutStrategy: ( dialog, simBounds, screenBounds, scale ) => {
        assert && assert( dialog.layoutBounds );

        // a little below center, so that it does not overlap the Amplitudes chart
        dialog.centerX = dialog.layoutBounds.centerX;
        dialog.centerY = dialog.layoutBounds.centerY + 50;
      },

      // phet-io
      phetioReadOnly: true
    }, options );

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
      buttonFont: BUTTON_FONT
    } );

    const orderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      isValidValue: value => ( value > 0 )
    } );

    // Title indicates which amplitude we're editing, e.g. A<sub>2</sub>.
    const titleStringProperty = new DerivedProperty( [ FMWSymbols.AStringProperty, orderProperty ],
      ( A, order ) => `${A}<sub>${order}</sub>` );
    const titleNode = new RichText( titleStringProperty, {
      font: TITLE_FONT,
      maxWidth: keypad.width
    } );

    // Range of valid values is shown
    const rangeStringProperty = new PatternStringProperty( FourierMakingWavesStrings.minToMaxStringProperty, {
      min: Utils.toFixedNumber( amplitudeRange.min, options.decimalPlaces ),
      max: Utils.toFixedNumber( amplitudeRange.max, options.decimalPlaces )
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
      } )
    } );

    // Vertical layout
    const content = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ titleNode, rangeNode, stringDisplay, keypad, enterButton ]
    } );

    super( content, options );

    // @private
    this.keypad = keypad; // {KeyPad}
    this.titleNode = titleNode; // {RichText}
    this.orderProperty = orderProperty;

    // @private {function(amplitude:number)|null} called when the Enter button fires
    this.enterCallback = null;

    // @private {function|null} called when the dialog has been closed
    this.closeCallback = null;

    // When the Enter button fires...
    enterButton.addListener( () => {
      const value = this.keypad.valueProperty.value;
      if ( value === null ) {

        // Nothing was entered, so do nothing.
      }
      else if ( amplitudeRange.contains( value ) ) {

        // A valid value was entered. Provide the value to the client and close the dialog.
        this.enterCallback( value );
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
   * @param {number} order - the order of the harmonic
   * @param {function(amplitude:number)} enterCallback - called when the Enter button fires
   * @param {function} closeCallback - called when the dialog has been closed
   * @public
   * @override
   */
  show( order, enterCallback, closeCallback ) {
    assert && AssertUtils.assertPositiveInteger( order );
    assert && assert( typeof enterCallback === 'function' );
    assert && assert( typeof closeCallback === 'function' );

    this.orderProperty.value = order; // causes titleNode to update
    this.enterCallback = enterCallback;
    this.closeCallback = closeCallback;
    this.keypad.clear();

    super.show();
  }

  /**
   * Hides the dialog.
   * @public
   * @override
   */
  hide() {
    super.hide();

    this.interruptSubtreeInput();
    this.closeCallback();
    this.enterCallback = null;
    this.closeCallback = null;
    this.keypad.clear();
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

/**
 * Displays a Keypad's stringProperty value, showing what keys the user has 'typed'.
 */
class KeypadStringDisplay extends Node {

  /**
   * @param {ReadOnlyProperty.<string>} stringProperty
   * @param {Object} [options]
   */
  constructor( stringProperty, options ) {

    assert && AssertUtils.assertAbstractPropertyOf( stringProperty, 'string' );

    options = merge( {

      // StringDisplay options
      align: 'center',
      width: 100,
      height: 50,
      xMargin: 0,
      yMargin: 0,
      stringFormat: string => string,

      // Rectangle options
      rectangleOptions: {
        cornerRadius: 0,
        fill: 'white',
        stroke: 'black'
      },

      // Text options
      textOptions: {
        fill: 'black',
        font: KEYPAD_DISPLAY_FONT
      }
    }, options );

    assert && assert( ALIGN_VALUE_VALUES.includes( options.align ), `invalid align: ${options.align}` );

    const rectangle = new Rectangle( 0, 0, options.width, options.height, options.rectangleOptions );

    const textNode = new RichText( '', merge( {
      maxWidth: rectangle.width - 2 * options.xMargin,
      maxHeight: rectangle.height - 2 * options.yMargin
    }, options.textOptions ) );

    assert && assert( !options.children, 'StringDisplay sets children' );
    options.children = [ rectangle, textNode ];

    super( options );

    // Display the string value. unlink is required on dispose.
    const stringListener = string => { textNode.string = options.stringFormat( string ); };
    stringProperty.link( stringListener );

    // Keep the text centered in the background. unlink is not required.
    textNode.boundsProperty.link( () => {
      textNode.center = rectangle.center;
    } );

    // @private
    this.textNode = textNode; // {RichText}

    // @private
    this.disposeStringDisplay = () => {
      stringProperty.unlink( stringListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeStringDisplay();
    super.dispose();
  }

  /**
   * Sets the fill for the text.
   * @param {string} fill
   * @public
   */
  setTextFill( fill ) {
    this.textNode.fill = fill;
  }
}

fourierMakingWaves.register( 'AmplitudeKeypadDialog', AmplitudeKeypadDialog );
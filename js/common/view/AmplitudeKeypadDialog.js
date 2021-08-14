// Copyright 2020-2021, University of Colorado Boulder

/**
 * AmplitudeKeypadDialog is a Dialog that provides a keypad for entering an amplitude value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
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

class AmplitudeKeypadDialog extends Dialog {

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
      }
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

    // Title indicates which amplitude we're editing, e.g. A<sub>2</sub>.
    // titleNode.text is set when the dialog is opened.
    const titleNode = new RichText( '', {
      font: TITLE_FONT,
      maxWidth: keypad.width
    } );

    // Range of valid values is shown
    const rangeNode = new Text( StringUtils.fillIn( fourierMakingWavesStrings.minToMax, {
      min: Utils.toFixedNumber( amplitudeRange.min, options.decimalPlaces ),
      max: Utils.toFixedNumber( amplitudeRange.max, options.decimalPlaces )
    } ), {
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
      content: new Text( fourierMakingWavesStrings.enter, {
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
    this.keypad = keypad;
    this.titleNode = titleNode;
    this.order = null; // { number|null} number when showing, null when hidden

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

    this.titleNode.text = `${FMWSymbols.A}<sub>${order}</sub>`;
    this.order = order;
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
    this.order = null;
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
   * @param {Property.<string>} stringProperty
   * @param {Object} [options]
   */
  constructor( stringProperty, options ) {

    assert && AssertUtils.assertPropertyOf( stringProperty, 'string' );

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
    const stringListener = string => { textNode.text = options.stringFormat( string ); };
    stringProperty.link( stringListener );

    // Keep the text centered in the background. unlink is not required.
    textNode.boundsProperty.link( () => {
      textNode.center = rectangle.center;
    } );

    // @private
    this.textNode = textNode;

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
export default AmplitudeKeypadDialog;
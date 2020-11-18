// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
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
const FONT = new PhetFont( 14 );

class AmplitudeKeypadDialog extends Dialog {

  /**
   * @param {Range} amplitudeRange
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( amplitudeRange, layoutBounds, options ) {

    assert && assert( amplitudeRange instanceof Range, 'invalid amplitudeRange' );
    assert && assert( layoutBounds instanceof Bounds2, 'invalid layoutBounds' );

    options = merge( {
      order: 1,
      amplitude: 0,

      // Dialog options
      fill: 'rgb( 240, 240, 240 )',
      stroke: 'rgb( 50, 50, 50 )',
      closeButtonLength: 12,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,
      layoutStrategy: ( dialog, simBounds, screenBounds, scale ) => {
        dialog.centerX = layoutBounds.centerX;
        dialog.centerY = layoutBounds.centerY + 50;
      }
    }, options );

    const maxDigits = Math.max(
      Utils.toFixed( amplitudeRange.min, FMWConstants.AMPLITUDE_DECIMAL_PLACES ).replace( /[^0-9]/g, '' ).length,
      Utils.toFixed( amplitudeRange.max, FMWConstants.AMPLITUDE_DECIMAL_PLACES ).replace( /[^0-9]/g, '' ).length
    );

    const keypad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
      maxDigits: maxDigits,
      maxDigitsRightOfMantissa: FMWConstants.AMPLITUDE_DECIMAL_PLACES,
      buttonWidth: 25,
      buttonHeight: 25,
      buttonFont: BUTTON_FONT
    } );

    const titleFont = new RichText( '', {
      font: TITLE_FONT,
      maxWidth: keypad.width
    } );

    const rangeNode = new Text( StringUtils.fillIn( fourierMakingWavesStrings.minToMax, {
        min: Utils.toFixedNumber( amplitudeRange.min, FMWConstants.AMPLITUDE_DECIMAL_PLACES ),
        max: Utils.toFixedNumber( amplitudeRange.max, FMWConstants.AMPLITUDE_DECIMAL_PLACES )
      } ), {
        font: FONT,
        maxWidth: keypad.width
      } );

    const valueNode = new Text( '0', {
      font: FONT,
      fill: 'black'
    } );

    const valueBackgroundNode = new Rectangle( 0, 0, keypad.width, 2 * valueNode.height, {
      cornerRadius: 2,
      fill: 'white',
      stroke: 'black'
    } );

    const valueDisplay = new Node( {
      children: [ valueBackgroundNode, valueNode ]
    } );

    const enterButton = new RectangularPushButton( {
      listener: () => {
        const value = this.getKeypadValue();
        if ( value === null || amplitudeRange.contains( value ) ) {
          this.hide();
        }
        else {
          rangeNode.fill = 'red';
          valueNode.fill = 'red';
        }
      },
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      content: new Text( fourierMakingWavesStrings.enter, {
        font: FONT,
        maxWidth: keypad.width
      } )
    } );

    const content = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ titleFont, rangeNode, valueDisplay, keypad, enterButton ]
    } );

    assert && assert( !options.closeButtonListener, 'AmplitudeKeypadDialog sets closeButtonListener' );
    options.closeButtonListener = () => {
      this.clearKeypad();
      this.hide();
    };

    super( content, options );

    // @private
    this.titleFont = titleFont;
    this.keypad = keypad;

    this.setOrder( options.order );

    this.keypad.stringProperty.link( string => {
      valueNode.text = string;
      valueNode.center = valueBackgroundNode.center;
    } );

    this.keypad.accumulatedKeysProperty.link( () => {
      rangeNode.fill = 'black';
      valueNode.fill = 'black';
    } );
  }

  /**
   * Sets the order of the harmonic that we're editing, as displayed in the title.
   * @param {number} order
   * @public
   */
  setOrder( order ) {
    this.titleFont.text = StringUtils.fillIn( fourierMakingWavesStrings.amplitudeSymbolOrder, {
      symbol: FMWSymbols.CAPITAL_A,
      order: order
    } );
  }

  /**
   * Clears the keypad.
   * @public
   */
  clearKeypad() {
    this.keypad.clear();
  }

  /**
   * Gets the value entered on the keypad, null if no value was entered.
   * @returns {number|null}
   * @public
   */
  getKeypadValue() {
    return this.keypad.valueProperty.value;
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

fourierMakingWaves.register( 'AmplitudeKeypadDialog', AmplitudeKeypadDialog );
export default AmplitudeKeypadDialog;
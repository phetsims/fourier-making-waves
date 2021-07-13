// Copyright 2020-2021, University of Colorado Boulder

//TODO migrate to scenery-phet?
/**
 * StringDisplay displays a string value in a rectangle. The rectangle dimensions are constant, and the string will
 * be scaled to fit inside the rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const DEFAULT_FONT = new PhetFont( 12 );
const ALIGN_VALUE_VALUES = [ 'left', 'center', 'right' ];

class StringDisplay extends Node {

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
        font: DEFAULT_FONT
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
    this.rectangle = rectangle;
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
   * Sets the fill for the rectangle.
   * @param {string} fill
   * @public
   */
  setRectangleFill( fill ) {
    this.rectangle.fill = fill;
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

fourierMakingWaves.register( 'StringDisplay', StringDisplay );
export default StringDisplay;
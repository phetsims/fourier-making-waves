// Copyright 2020, University of Colorado Boulder

//TODO this is a bit like NumberDisplay, but not currently general enough for common code
/**
 * StringDisplay displays a string value in a rectangle. It's used to display what the user has typed on the
 * Keypad, which is in string format.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const DEFAULT_FONT = new PhetFont( 12 );

class StringDisplay extends Node {

  /**
   * @param {Property.<string>} stringProperty
   * @param {Object} [options]
   */
  constructor( stringProperty, options ) {

    options = merge( {
      width: 100,
      height: 50,
      xMargin: 0,
      yMargin: 0,
      rectangleOptions: {
        width: 100,
        height: 50,
        cornerRadius: 0,
        fill: 'white',
        stroke: 'black'
      },
      textOptions: {
        fill: 'black',
        font: DEFAULT_FONT
      }
    }, options );

    const backgroundNode = new Rectangle( 0, 0, options.width, options.height, options.rectangleOptions );

    const stringNode = new RichText( '0', merge( {
      maxWidth: backgroundNode.width - 2 * options.xMargin,
      maxHeight: backgroundNode.height - 2 * options.yMargin
    }, options.textOptions ) );

    assert && assert( !options.children, 'StringDisplay sets children' );
    options.children = [ backgroundNode, stringNode ];

    super( options );

    const stringListener = value => {
      stringNode.text = value;
      stringNode.center = backgroundNode.center;
    };
    stringProperty.link( stringListener ); // unlink is required on dispose

    // @private
    this.stringNode = stringNode;

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
   * Sets the fill used to display the string.
   * @param {string} fill
   * @public
   */
  setStringFill( fill ) {
    this.stringNode.fill = fill;
  }
}

fourierMakingWaves.register( 'StringDisplay', StringDisplay );
export default StringDisplay;
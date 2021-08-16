// Copyright 2020-2021, University of Colorado Boulder

/**
 * FMWComboBox creates a combo box using a set of value/string choices, used to generate the standard set of
 * {ComboBoxItem[]} items needed by a ComboBox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

class FMWComboBox extends ComboBox {

  /**
   * @param {value:*, string:string, [textOptions:Object], [tandemName:string]} choices
   * @param {Property} property
   * @param {Node} listboxParent
   * @param {Object} [options]
   */
  constructor( choices, property, listboxParent, options ) {

    assert && AssertUtils.assertArray( choices );
    assert && assert( property instanceof Property );
    assert && assert( listboxParent instanceof Node );

    options = merge( {

      // RichText options
      textOptions: {
        font: FMWConstants.CONTROL_FONT
      },

      // ComboBox options
      xMargin: 12,
      yMargin: 5
    }, options );

    const items = []; // {ComboBoxItem[]}
    choices.forEach( choice => {
      assert && assert( typeof choice.string === 'string', `invalid choice.string: ${choice.string}` );

      // The majority of strings in this sim contain RichText markup, used to display symbols in MathSymbolFont.
      // And there is negligible performance impact for using RichText for the strings that don't contain markup.
      const node = new RichText( choice.string, choice.textOptions || options.textOptions );

      items.push( new ComboBoxItem( node, choice.value, {
        tandemName: choice.tandemName || null
      } ) );
    } );

    super( items, property, listboxParent, options );
  }
}

fourierMakingWaves.register( 'FMWComboBox', FMWComboBox );
export default FMWComboBox;
// Copyright 2020-2022, University of Colorado Boulder

/**
 * FMWComboBox is a specialization of ComboBox that provides an API for specifying combo box items that is more
 * suited to this simulation. Items are specified as a set of value/string choices, and FMWComboBox generates
 * the {ComboBoxItem[]} items needed by ComboBox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

class FMWComboBox extends ComboBox {

  /**
   * @param {Property} property
   * @param {{value:*, string:string, [textOptions:Object], [tandemName:string]}[]} choices
   * @param {Node} listboxParent
   * @param {Object} [options]
   */
  constructor( property, choices, listboxParent, options ) {

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

    // {ComboBoxItem[]}
    const items = choices.map( choice => {
      assert && assert( typeof choice.string === 'string', `invalid choice.string: ${choice.string}` );

      // The majority of strings in this sim contain RichText markup, used to display symbols in MathSymbolFont.
      // And there is negligible performance impact for using RichText for the strings that don't contain markup.
      const node = new RichText( choice.string, choice.textOptions || options.textOptions );

      return {
        value: choice.value,
        node: node,
        tandemName: choice.tandemName || null
      };
    } );

    super( property, items, listboxParent, options );
  }
}

fourierMakingWaves.register( 'FMWComboBox', FMWComboBox );
export default FMWComboBox;
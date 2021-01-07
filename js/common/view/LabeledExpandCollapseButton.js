// Copyright 2021, University of Colorado Boulder

/**
 * LabeledExpandCollapseButton adds a label to the right of an ExpandCollapseButton.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

class LabeledExpandCollapseButton extends HBox {

  /**
   * @param {string} labelString
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   */
  constructor( labelString, expandedProperty, options ) {

    options = merge( {

      // options propagated to ExpandCollapseButton
      expandCollapseButtonOptions: FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS,

      // options propagated to Text
      textOptions: {
        font: FMWConstants.TITLE_FONT
      },

      // HBox options
      spacing: 6,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( labelString,
      merge( {
        tandem: options.tandem.createTandem( 'labelNode' )
      }, options.textOptions ) );

    const expandCollapseButton = new ExpandCollapseButton( expandedProperty,
      merge( {
        tandem: options.tandem.createTandem( 'expandCollapseButton' )
      }, options.expandCollapseButtonOptions ) );

    assert && assert( !options.children, 'LabeledExpandCollapseButton sets children' );
    options.children = [ expandCollapseButton, labelNode ];

    super( options );
  }
}

fourierMakingWaves.register( 'LabeledExpandCollapseButton', LabeledExpandCollapseButton );
export default LabeledExpandCollapseButton;
// Copyright 2021, University of Colorado Boulder

/**
 * LabeledExpandCollapseButton adds a label to the right of an ExpandCollapseButton.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
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

      // HBox options
      spacing: 6,

      // ExpandCollapseButton options
      expandCollapseButtonOptions: FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS,

      // Text options
      textOptions: {
        font: FMWConstants.TITLE_FONT,
        maxWidth: FMWConstants.CHART_TITLE_MAX_WIDTH
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( labelString, merge( {
      cursor: 'pointer',
      tandem: options.tandem.createTandem( 'labelNode' )
    }, options.textOptions ) );

    const expandCollapseButton = new ExpandCollapseButton( expandedProperty, merge( {
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      tandem: options.tandem.createTandem( 'expandCollapseButton' )
    }, options.expandCollapseButtonOptions ) );

    assert && assert( !options.children, 'LabeledExpandCollapseButton sets children' );
    options.children = [ expandCollapseButton, labelNode ];

    super( options );

    // Clicking on the label toggles expandedProperty
    //REVIEW: FireListener recommended here. A "press on it, then move off and release" still triggers this
    labelNode.addInputListener( new PressListener( {
      release: () => {
        expandedProperty.value = !expandedProperty.value;
      }
    } ) );
  }
}

fourierMakingWaves.register( 'LabeledExpandCollapseButton', LabeledExpandCollapseButton );
export default LabeledExpandCollapseButton;
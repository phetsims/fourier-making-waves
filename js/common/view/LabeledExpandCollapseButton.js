// Copyright 2021-2023, University of Colorado Boulder

/**
 * LabeledExpandCollapseButton adds a label to the right of an ExpandCollapseButton.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { FireListener, HBox, Text } from '../../../../scenery/js/imports.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

export default class LabeledExpandCollapseButton extends HBox {

  /**
   * @param {TReadOnlyProperty.<string>} labelStringProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   */
  constructor( labelStringProperty, expandedProperty, options ) {

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

    const labelText = new Text( labelStringProperty, merge( {
      cursor: 'pointer',
      tandem: options.tandem.createTandem( 'labelText' )
    }, options.textOptions ) );

    const expandCollapseButton = new ExpandCollapseButton( expandedProperty, merge( {
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      tandem: options.tandem.createTandem( 'expandCollapseButton' )
    }, options.expandCollapseButtonOptions ) );

    assert && assert( !options.children, 'LabeledExpandCollapseButton sets children' );
    options.children = [ expandCollapseButton, labelText ];

    super( options );

    // Clicking on the label toggles expandedProperty
    labelText.addInputListener( new FireListener( {
      fire: () => {
        expandedProperty.value = !expandedProperty.value;
      }
    } ) );
  }
}

fourierMakingWaves.register( 'LabeledExpandCollapseButton', LabeledExpandCollapseButton );
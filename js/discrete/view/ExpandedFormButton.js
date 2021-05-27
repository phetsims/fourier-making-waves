// Copyright 2020, University of Colorado Boulder

/**
 * ExpandedFormButton is the push button used to open the 'Expanded Form' dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ExpandedFormButton extends RoundPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // RoundPushButton options
      baseColor: Color.grayColor( 238 ),
      xMargin: 10,
      yMargin: 10
    }, options );

    assert && assert( !options.content, 'RoundPushButton sets content' );
    options.content = new FontAwesomeNode( 'eye_open', {
      scale: 0.9
    } );

    super( options );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'ExpandedFormButton', ExpandedFormButton );
export default ExpandedFormButton;
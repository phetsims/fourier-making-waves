// Copyright 2020-2021, University of Colorado Boulder

/**
 * ExpandedFormButton is the push button used to open the 'Expanded Form' dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import eyeRegularShape from '../../../../sherpa/js/fontawesome-5/eyeRegularShape.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
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
    options.content = new Path( eyeRegularShape, {
      scale: 0.072,
      fill: 'black'
    } );

    super( options );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'ExpandedFormButton', ExpandedFormButton );
export default ExpandedFormButton;
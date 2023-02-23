// Copyright 2020-2023, University of Colorado Boulder

/**
 * ExpandedFormButton is the push button used to open the 'Expanded Form' dialog. It appear next to the equation
 * about the Sum chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Color, Path } from '../../../../scenery/js/imports.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class ExpandedFormButton extends RoundPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // RoundPushButton options
      baseColor: Color.grayColor( 238 ),
      xMargin: 10,
      yMargin: 10,
      touchAreaDilation: 15
    }, options );

    assert && assert( !options.content, 'RoundPushButton sets content' );
    options.content = new Path( eyeSolidShape, {
      scale: 0.072,
      fill: 'black'
    } );

    super( options );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'ExpandedFormButton', ExpandedFormButton );
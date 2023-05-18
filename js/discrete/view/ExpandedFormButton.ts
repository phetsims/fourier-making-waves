// Copyright 2020-2023, University of Colorado Boulder

/**
 * ExpandedFormButton is the push button used to open the 'Expanded Form' dialog. It appears next to the equation
 * above the Sum chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color, Path } from '../../../../scenery/js/imports.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ExpandedFormButton extends RoundPushButton {

  public constructor( expandedFormDialog: Dialog, tandem: Tandem ) {

    const icon = new Path( eyeSolidShape, {
      scale: 0.072,
      fill: 'black'
    } );

    super( {

      // RoundPushButtonOptions
      content: icon,
      listener: () => expandedFormDialog.show(),
      scale: 0.45,
      baseColor: Color.grayColor( 238 ),
      xMargin: 10,
      yMargin: 10,
      touchAreaDilation: 15,
      phetioDocumentation: 'Pressing this button opens a dialog that shows the expanded form of the Sum equation.',
      tandem: tandem
    } );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'ExpandedFormButton', ExpandedFormButton );
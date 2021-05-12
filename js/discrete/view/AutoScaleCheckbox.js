// Copyright 2020, University of Colorado Boulder

/**
 * AutoScaleCheckbox is the checkbox labeled 'Auto Scale'. Checking it causes the Sum chart's y axis to automatically
 * scale to fit the entire plot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class AutoScaleCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} yAutoScaleProperty
   * @param {Object} [options]
   */
  constructor( yAutoScaleProperty, options ) {

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    const labelNode = new Text( fourierMakingWavesStrings.autoScale, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200 // determined empirically
    } );

    super( labelNode, yAutoScaleProperty, options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( 6, 6 );
    this.mouseArea = this.localBounds.dilatedXY( 1, 1 );
  }
}

fourierMakingWaves.register( 'AutoScaleCheckbox', AutoScaleCheckbox );
export default AutoScaleCheckbox;
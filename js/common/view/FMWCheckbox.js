// Copyright 2021, University of Colorado Boulder

/**
 * FMWCheckbox is a Checkbox subclass that implements styling and pointer areas for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

class FMWCheckbox extends Checkbox {

  /**
   * @param {Node} content
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( content, property, options ) {

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, {

      // pointer area dilation
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      mouseAreaXDilation: 1,
      mouseAreaYDilation: 1
    }, options );

    super( content, property, options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
    this.mouseArea = this.localBounds.dilated( options.mouseAreaXDilation, options.mouseAreaYDilation );
  }
}

fourierMakingWaves.register( 'FMWCheckbox', FMWCheckbox );
export default FMWCheckbox;
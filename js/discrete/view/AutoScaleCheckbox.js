// Copyright 2020-2021, University of Colorado Boulder

/**
 * AutoScaleCheckbox is the checkbox labeled 'Auto Scale'. Checking it causes the Sum chart's y axis to automatically
 * scale to fit the entire plot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class AutoScaleCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} yAutoScaleProperty
   * @param {Object} [options]
   */
  constructor( yAutoScaleProperty, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    const autoScaleText = new Text( fourierMakingWavesStrings.autoScale, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'autoScaleText' )
    } );

    super( autoScaleText, yAutoScaleProperty, options );
  }
}

fourierMakingWaves.register( 'AutoScaleCheckbox', AutoScaleCheckbox );
export default AutoScaleCheckbox;
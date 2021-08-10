// Copyright 2021, University of Colorado Boulder

/**
 * PeriodCheckbox is the checkbox that is used to show the period tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class PeriodCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} isSelectedProperty
   * @param {Object} [options]
   */
  constructor( isSelectedProperty, options ) {

    assert && AssertUtils.assertPropertyOf( isSelectedProperty, 'boolean' );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    const periodText = new Text( fourierMakingWavesStrings.period, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: options.tandem.createTandem( 'periodText' )
    } );

    super( periodText, isSelectedProperty, options );

    // pointer areas
    this.touchArea = this.localBounds.dilated( FMWConstants.CHECKBOX_TOUCH_AREA_DILATION );
    this.mouseArea = this.localBounds.dilated( FMWConstants.CHECKBOX_MOUSE_AREA_DILATION );
  }
}

fourierMakingWaves.register( 'PeriodCheckbox', PeriodCheckbox );
export default PeriodCheckbox;
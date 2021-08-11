// Copyright 2021, University of Colorado Boulder

/**
 * PeriodCheckbox is the checkbox that is used to show the period tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class PeriodCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} isSelectedProperty
   * @param {Object} [options]
   */
  constructor( isSelectedProperty, options ) {

    assert && AssertUtils.assertPropertyOf( isSelectedProperty, 'boolean' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    const periodText = new Text( fourierMakingWavesStrings.period, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: options.tandem.createTandem( 'periodText' )
    } );

    super( periodText, isSelectedProperty, options );
  }
}

fourierMakingWaves.register( 'PeriodCheckbox', PeriodCheckbox );
export default PeriodCheckbox;
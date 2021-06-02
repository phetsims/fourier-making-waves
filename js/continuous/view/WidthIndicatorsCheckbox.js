// Copyright 2021, University of Colorado Boulder

/**
 * TODO
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

class WidthIndicatorsCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( widthIndicatorsVisibleProperty, options ) {

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    const widthIndicatorsText = new Text( fourierMakingWavesStrings.widthIndicators, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200
    } );

    super( widthIndicatorsText, widthIndicatorsVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'WidthIndicatorsCheckbox', WidthIndicatorsCheckbox );
export default WidthIndicatorsCheckbox;
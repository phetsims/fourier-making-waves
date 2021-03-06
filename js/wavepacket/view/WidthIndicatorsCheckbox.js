// Copyright 2021, University of Colorado Boulder

/**
 * WidthIndicatorsCheckbox is the checkbox used to show width indicators on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWIconFactory from '../../common/view/FMWIconFactory.js';
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

    const textNode = new Text( fourierMakingWavesStrings.widthIndicators, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    const iconNode = FMWIconFactory.createWidthIndicatorsIcon();

    const content = new HBox( {
      children: [ textNode, iconNode ],
      spacing: 10
    } );

    super( content, widthIndicatorsVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'WidthIndicatorsCheckbox', WidthIndicatorsCheckbox );
export default WidthIndicatorsCheckbox;
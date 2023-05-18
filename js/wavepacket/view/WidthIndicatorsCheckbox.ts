// Copyright 2021-2023, University of Colorado Boulder

/**
 * WidthIndicatorsCheckbox is the checkbox used to show width indicators on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWIconFactory from '../../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class WidthIndicatorsCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( widthIndicatorsVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
      tandem: Tandem.REQUIRED
    }, options );

    const widthIndicatorsText = new Text( FourierMakingWavesStrings.widthIndicatorsStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 100,
      tandem: options.tandem.createTandem( 'widthIndicatorsText' )
    } );

    const iconNode = FMWIconFactory.createWidthIndicatorsIcon();

    const content = new HBox( {
      children: [ widthIndicatorsText, iconNode ],
      spacing: 10
    } );

    super( widthIndicatorsVisibleProperty, content, options );
  }
}

fourierMakingWaves.register( 'WidthIndicatorsCheckbox', WidthIndicatorsCheckbox );
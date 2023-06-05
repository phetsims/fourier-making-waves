// Copyright 2021-2023, University of Colorado Boulder

/**
 * WidthIndicatorsCheckbox is the checkbox used to show width indicators on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWIconFactory from '../../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class WidthIndicatorsCheckbox extends Checkbox {

  public constructor( widthIndicatorsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const widthIndicatorsText = new Text( FourierMakingWavesStrings.widthIndicatorsStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    const iconNode = FMWIconFactory.createWidthIndicatorsIcon();

    const content = new HBox( {
      children: [ widthIndicatorsText, iconNode ],
      spacing: 10
    } );

    super( widthIndicatorsVisibleProperty, content, combineOptions<CheckboxOptions>( {}, FMWConstants.CHECKBOX_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

fourierMakingWaves.register( 'WidthIndicatorsCheckbox', WidthIndicatorsCheckbox );
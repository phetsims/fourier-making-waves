// Copyright 2021-2025, University of Colorado Boulder

/**
 * SecondaryWaveformCheckbox is the base class for checkboxes that are used to plot a secondary waveform on a chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class SecondaryWaveformCheckbox extends Checkbox {

  protected constructor( visibleProperty: Property<boolean>, titleStringProperty: TReadOnlyProperty<string>, tandem: Tandem ) {

    const infiniteHarmonicsText = new Text( titleStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200
    } );

    const icon = new Line( 0, 0, 20, 0, {
      stroke: FMWColors.secondaryWaveformStrokeProperty,
      lineWidth: FMWConstants.SECONDARY_WAVEFORM_LINE_WIDTH
    } );

    const hBox = new HBox( {
      children: [ infiniteHarmonicsText, icon ],
      spacing: 6
    } );

    super( visibleProperty, hBox, combineOptions<CheckboxOptions>( {}, FMWConstants.CHECKBOX_OPTIONS, {
      isDisposable: false,
      tandem: tandem
    } ) );
  }
}

fourierMakingWaves.register( 'SecondaryWaveformCheckbox', SecondaryWaveformCheckbox );
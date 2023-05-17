// Copyright 2021-2023, University of Colorado Boulder

/**
 * SecondaryWaveformCheckbox is the base class for checkboxes that are used to plot a secondary waveform on a chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HBox, Line, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class SecondaryWaveformCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {TReadOnlyProperty.<string>} titleStringProperty
   * @param {Object} [options]
   */
  constructor( visibleProperty, titleStringProperty, options ) {

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
      textOptions: {
        font: FMWConstants.CONTROL_FONT,
        maxWidth: 200
      },
      tandem: Tandem.REQUIRED
    }, options );

    const infiniteHarmonicsText = new Text( titleStringProperty, merge( {}, options.textOptions, {
      tandem: options.tandem.createTandem( 'infiniteHarmonicsText' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } ) );

    const icon = new Line( 0, 0, 20, 0, {
      stroke: FMWColors.secondaryWaveformStrokeProperty,
      lineWidth: FMWConstants.SECONDARY_WAVEFORM_LINE_WIDTH
    } );

    const hBox = new HBox( {
      children: [ infiniteHarmonicsText, icon ],
      spacing: 6
    } );

    super( visibleProperty, hBox, options );
  }
}

fourierMakingWaves.register( 'SecondaryWaveformCheckbox', SecondaryWaveformCheckbox );
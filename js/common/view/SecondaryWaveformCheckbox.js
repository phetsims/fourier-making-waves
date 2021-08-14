// Copyright 2020-2021, University of Colorado Boulder

/**
 * SecondaryWaveformCheckbox is the base class for checkboxes that are used to plot a secondary waveform on a chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class SecondaryWaveformCheckbox extends FMWCheckbox {

  /**
   * @param {string} title
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [options]
   */
  constructor( title, visibleProperty, options ) {

    options = merge( {
      textOptions: {
        font: FMWConstants.CONTROL_FONT,
        maxWidth: 200
      },
      tandem: Tandem.REQUIRED
    }, options );

    const infiniteHarmonicsText = new Text( title, merge( {}, options.textOptions, {
      tandem: options.tandem.createTandem( 'infiniteHarmonicsText' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } ) );

    const icon = new Line( 0, 0, 20, 0, {
      stroke: FMWColors.secondardWaveformStrokeProperty,
      lineWidth: FMWConstants.SECONDARY_WAVEFORM_LINE_WIDTH
    } );

    const hBox = new HBox( {
      children: [ infiniteHarmonicsText, icon ],
      spacing: 6
    } );

    super( hBox, visibleProperty, options );
  }
}

fourierMakingWaves.register( 'SecondaryWaveformCheckbox', SecondaryWaveformCheckbox );
export default SecondaryWaveformCheckbox;
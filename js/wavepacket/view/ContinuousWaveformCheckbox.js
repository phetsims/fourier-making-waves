// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousWaveformCheckbox is the checkbox that is used to show the wave packet's waveform.
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

class ContinuousWaveformCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} continuousWaveformVisibleProperty
   * @param {Object} [options]
   */
  constructor( continuousWaveformVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( continuousWaveformVisibleProperty, 'boolean' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    const continuousWaveformText = new Text( fourierMakingWavesStrings.continuousWaveform, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200,
      tandem: options.tandem.createTandem( 'continuousWaveformText' )
    } );

    super( continuousWaveformText, continuousWaveformVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'ContinuousWaveformCheckbox', ContinuousWaveformCheckbox );
export default ContinuousWaveformCheckbox;
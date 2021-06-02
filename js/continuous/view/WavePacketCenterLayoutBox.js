// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketCenterLayoutBox is the 'Wave Packet Center' section of the control panel in the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class WavePacketCenterLayoutBox extends VBox {

  /**
   * @param {Property.<number>} wavePacketCenterProperty
   * @param {Object} [options]
   */
  constructor( wavePacketCenterProperty, options ) {

    assert && AssertUtils.assertPropertyOf( wavePacketCenterProperty, 'number' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, FMWConstants.VBOX_OPTIONS, options );

    // Component Spacing
    const wavePacketCenterText = new Text( fourierMakingWavesStrings.wavePacketCenter, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketCenterText' )
    } );

    //TODO center slider

    assert && assert( !options.children, 'WavePacketCenterLayoutBox sets children' );
    options.children = [
      wavePacketCenterText
    ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketCenterLayoutBox', WavePacketCenterLayoutBox );
export default WavePacketCenterLayoutBox;
// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketWidthLayoutBox is the 'Wave Packet Width' section of the control panel in the 'Continuous' screen.
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

class WavePacketWidthLayoutBox extends VBox {

  /**
   * @param {Property.<number>} kWidthProperty
   * @param {Property.<number>} xWidthProperty
   * @param {Object} [options]
   */
  constructor( kWidthProperty, xWidthProperty, options ) {

    assert && AssertUtils.assertPropertyOf( kWidthProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xWidthProperty, 'number' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, FMWConstants.VBOX_OPTIONS, options );

    // Component Spacing
    const wavePacketWidthText = new Text( fourierMakingWavesStrings.wavePacketWidth, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketWidthText' )
    } );

    //TODO k width slider
    //TODO x width slider

    assert && assert( !options.children, 'WavePacketWidthLayoutBox sets children' );
    options.children = [
      wavePacketWidthText
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

fourierMakingWaves.register( 'WavePacketWidthLayoutBox', WavePacketWidthLayoutBox );
export default WavePacketWidthLayoutBox;
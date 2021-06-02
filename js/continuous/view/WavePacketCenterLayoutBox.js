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
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketCenterControl from './WavePacketCenterControl.js';

class WavePacketCenterLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} wavePacketCenterProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, wavePacketCenterProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( wavePacketCenterProperty, 'number' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Component Spacing
    const wavePacketCenterText = new Text( fourierMakingWavesStrings.wavePacketCenter, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketCenterText' )
    } );

    // Value display and slider
    const wavePacketCenterControl = new WavePacketCenterControl( domainProperty, wavePacketCenterProperty, {
      tandem: options.tandem.createTandem( 'wavePacketCenterControl' )
    } );

    assert && assert( !options.children, 'WavePacketCenterLayoutBox sets children' );
    options.children = [
      wavePacketCenterText,
      wavePacketCenterControl
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
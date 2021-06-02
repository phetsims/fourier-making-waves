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
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketKWidthControl from './WavePacketKWidthControl.js';

class WavePacketWidthLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} kWidthProperty
   * @param {Property.<number>} xWidthProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, kWidthProperty, xWidthProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( kWidthProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xWidthProperty, 'number' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Component Spacing
    const wavePacketWidthText = new Text( fourierMakingWavesStrings.wavePacketWidth, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketWidthText' )
    } );

    const kWidthControl = new WavePacketKWidthControl( domainProperty, kWidthProperty, {
      tandem: options.tandem.createTandem( 'kWidthControl' )
    } );

    //TODO xWidthControl

    assert && assert( !options.children, 'WavePacketWidthLayoutBox sets children' );
    options.children = [
      wavePacketWidthText,
      kWidthControl
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
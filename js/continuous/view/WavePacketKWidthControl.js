// Copyright 2021, University of Colorado Boulder

//TODO use NumberControl
/**
 * WavePacketKWidthControl displays the wave packet width in k space, and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketKWidthSlider from './WavePacketKWidthSlider.js';

class WavePacketKWidthControl extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} kWidthProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, kWidthProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( kWidthProperty, 'number' );

    options = merge( {

      decimals: 2,

      // VBox options
      spacing: 5,
      align: 'left',

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const valueNode = new RichText( '', {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200,
      tandem: options.tandem.createTandem( 'valueNode' )
    } );

    const slider = new WavePacketKWidthSlider( kWidthProperty, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value.
    Property.multilink(
      [ domainProperty, kWidthProperty ],
      ( domain, kWidth ) => {
        valueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolSubscriptEqualsValueUnits, {
          symbol: FMWSymbols.sigma,
          subscript: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
          value: Utils.toFixedNumber( kWidth, options.decimals ),
          units: ( domain === Domain.SPACE ) ?
                 fourierMakingWavesStrings.units.radiansPerMeter :
                 fourierMakingWavesStrings.units.radiansPerMillisecond
        } );
      } );
  }
}

fourierMakingWaves.register( 'WavePacketKWidthControl', WavePacketKWidthControl );
export default WavePacketKWidthControl;
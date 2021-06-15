// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketCenterControl displays the wave packet center value, and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class WavePacketCenterControl extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} wavePacketCenterProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, wavePacketCenterProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( wavePacketCenterProperty instanceof NumberProperty );

    options = merge( {

      decimals: 1,

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

    const slider = new WavePacketCenterSlider( wavePacketCenterProperty, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value.
    Property.multilink(
      [ domainProperty, wavePacketCenterProperty ],
      ( domain, wavePacketCenter ) => {
        valueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolSubscriptEqualsValueUnits, {
          symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
          subscript: 0,
          value: Utils.toFixedNumber( wavePacketCenter, options.decimals ),
          units: ( domain === Domain.SPACE ) ?
                 fourierMakingWavesStrings.units.radiansPerMeter :
                 fourierMakingWavesStrings.units.radiansPerMillisecond
        } );
      } );
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

class WavePacketCenterSlider extends Slider {

  /**
   * @param {NumberProperty} wavePacketCenterProperty
   * @param {Object} [options]
   */
  constructor( wavePacketCenterProperty, options ) {

    assert && assert( wavePacketCenterProperty instanceof NumberProperty );
    assert && assert( wavePacketCenterProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // pdom options
      keyboardStep: 1,
      shiftKeyboardStep: 0.1,
      pageKeyboardStep: Math.PI
    }, options );

    super( wavePacketCenterProperty, wavePacketCenterProperty.range, options );

    //TODO handle this more robustly, less brute-force
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 9 * Math.PI, new RichText( `9${FMWSymbols.pi}`, textOptions ) );
    this.addMinorTick( 10 * Math.PI, new RichText( '', textOptions ) );
    this.addMinorTick( 11 * Math.PI, new RichText( '', textOptions ) );
    this.addMajorTick( 12 * Math.PI, new RichText( `12${FMWSymbols.pi}`, textOptions ) );
    this.addMinorTick( 13 * Math.PI, new RichText( '', textOptions ) );
    this.addMinorTick( 14 * Math.PI, new RichText( '', textOptions ) );
    this.addMajorTick( 15 * Math.PI, new RichText( `15${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'WavePacketCenterControl', WavePacketCenterControl );
export default WavePacketCenterControl;
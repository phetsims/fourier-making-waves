// Copyright 2021, University of Colorado Boulder

/**
 * K0Control displays the value of k0, the wave packet's center, and allows it to be changed via a slider.
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

class K0Control extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} k0Property
   * @param {Object} [options]
   */
  constructor( domainProperty, k0Property, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( k0Property instanceof NumberProperty );

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

    const slider = new K0Slider( k0Property, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value.
    Property.multilink(
      [ domainProperty, k0Property ],
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

class K0Slider extends Slider {

  /**
   * @param {NumberProperty} k0Property
   * @param {Object} [options]
   */
  constructor( k0Property, options ) {

    assert && assert( k0Property instanceof NumberProperty );
    assert && assert( k0Property.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // pdom options
      keyboardStep: 1,
      shiftKeyboardStep: 0.1,
      pageKeyboardStep: Math.PI
    }, options );

    super( k0Property, k0Property.range, options );

    // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 9 * Math.PI, new RichText( `9${FMWSymbols.pi}`, textOptions ) );
    this.addMinorTick( 10 * Math.PI );
    this.addMinorTick( 11 * Math.PI );
    this.addMajorTick( 12 * Math.PI, new RichText( `12${FMWSymbols.pi}`, textOptions ) );
    this.addMinorTick( 13 * Math.PI );
    this.addMinorTick( 14 * Math.PI );
    this.addMajorTick( 15 * Math.PI, new RichText( `15${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'K0Control', K0Control );
export default K0Control;
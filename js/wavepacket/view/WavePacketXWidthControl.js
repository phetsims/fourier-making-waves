// Copyright 2021, University of Colorado Boulder

//TODO use NumberControl
/**
 * WavePacketXWidthControl displays the wave packet width in x space, and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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

class WavePacketXWidthControl extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} xWidthProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, xWidthProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( xWidthProperty instanceof NumberProperty );

    options = merge( {

      decimals: 3,

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

    const slider = new WavePacketXWidthSlider( xWidthProperty, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value.
    Property.multilink(
      [ domainProperty, xWidthProperty ],
      ( domain, xWidth ) => {
        valueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolSubscriptEqualsValueUnits, {
          symbol: FMWSymbols.sigma,
          subscript: ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t,
          value: Utils.toFixedNumber( xWidth, options.decimals ),
          units: ( domain === Domain.SPACE ) ?
                 fourierMakingWavesStrings.units.radiansPerMeter :
                 fourierMakingWavesStrings.units.radiansPerMillisecond
        } );
      } );

    // @public {DerivedProperty.<boolean>} Whether the user is interacting with this control.
    this.isPressedProperty = new DerivedProperty(
      [ slider.thumbDragListener.isPressedProperty, slider.trackDragListener.isPressedProperty ],
      ( thumbIsPressed, trackIsPressed ) => ( thumbIsPressed || trackIsPressed ) );
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

class WavePacketXWidthSlider extends Slider {

  /**
   * @param {NumberProperty} xWidthProperty
   * @param {Object} [options]
   */
  constructor( xWidthProperty, options ) {

    assert && assert( xWidthProperty instanceof NumberProperty );
    assert && assert( xWidthProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // WavePacketXWidthSlider options
      tickDecimals: 3

      // pdom options
      //TODO alt input steps
    }, options );

    super( xWidthProperty, xWidthProperty.range, options );

    //TODO handle this more robustly, less brute-force
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 1, new RichText( '1', textOptions ) );
    this.addMajorTick( 1 / Math.PI, new RichText( `1/${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 1 / ( 4 * Math.PI ), new RichText( `1/(4${FMWSymbols.pi})`, textOptions ) );
  }
}

fourierMakingWaves.register( 'WavePacketXWidthControl', WavePacketXWidthControl );
export default WavePacketXWidthControl;
// Copyright 2021, University of Colorado Boulder

/**
 * DKControl displays the wave packet's dk value, and allows it to be changed via a slider.
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

class DKControl extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} dkProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, dkProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( dkProperty instanceof NumberProperty );

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

    const slider = new DKSlider( dkProperty, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value.
    Property.multilink(
      [ domainProperty, dkProperty ],
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

class DKSlider extends Slider {

  /**
   * @param {NumberProperty} dkProperty
   * @param {Object} [options]
   */
  constructor( dkProperty, options ) {

    assert && assert( dkProperty instanceof NumberProperty );
    assert && assert( dkProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // pdom options
      keyboardStep: 1,
      shiftKeyboardStep: 0.01,
      pageKeyboardStep: Math.PI
    }, options );

    super( dkProperty, dkProperty.range, options );

    // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
    // The assertion below should help with maintainability, in the event that dkProperty.range is changed.
    assert && assert( dkProperty.range.min === 1 && dkProperty.range.max === 4 * Math.PI );
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 1, new RichText( '1', textOptions ) );
    this.addMajorTick( Math.PI, new RichText( `${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 2 * Math.PI, new RichText( `2${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 3 * Math.PI, new RichText( `3${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 4 * Math.PI, new RichText( `4${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'DKControl', DKControl );
export default DKControl;
// Copyright 2021, University of Colorado Boulder

/**
 * K1Control displays the value of k1 (component spacing), and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
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

class K1Control extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {DerivedProperty} k1Property
   * @param {Object} [options]
   */
  constructor( domainProperty, k1Property, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( k1Property, 'number' );

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

    const slider = new K1Slider( k1Property, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value.
    Property.multilink(
      [ domainProperty, k1Property ],
      ( domain, k1 ) => {
        valueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolSubscriptEqualsValueUnits, {
          symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
          subscript: 1,
          value: Utils.toFixedNumber( k1, options.decimals ),
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

//TODO https://github.com/phetsims/fourier-making-waves/issues/54 UI sound
class K1Slider extends Slider {

  /**
   * @param {Property.<number>} k1Property
   * @param {Object} [options]
   */
  constructor( k1Property, options ) {

    assert && AssertUtils.assertPropertyOf( k1Property, 'number' );
    assert && assert( k1Property.validValues );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // Slider options
      constrainValue: value => Utils.roundSymmetric( value ),

      // pdom options - This is selecting an index, not the actual value. And there are only a few indices to chose
      // from, so no need for fine/course control with shift or page modifier keys
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 1
    }, options );

    // k1Property has a small set of valid values. Only those values are to be settable via this Slider, and they are
    // to be distributed at equally-space tick marks on the Slider. So we create an index into this set of values, and
    // control that index with the Slider. The selected index determines the value of k1 selected from its valid values.
    const validValues = k1Property.validValues;
    const defaultIndex = validValues.indexOf( k1Property.value );
    const k1IndexProperty = new NumberProperty( defaultIndex, {
      numberType: 'Integer',
      range: new Range( 0, validValues.length - 1 )
    } );

    super( k1IndexProperty, k1IndexProperty.range, options );

    // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
    // The assertion below should help with maintainability, in the event that k1Property.range is changed.
    assert && assert( k1IndexProperty.range.min === 0 && k1IndexProperty.range.max === 4 );
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 0, new RichText( '0', textOptions ) );
    this.addMajorTick( 1, new RichText( `${FMWSymbols.pi}/4`, textOptions ) );
    this.addMajorTick( 2, new RichText( `${FMWSymbols.pi}/2`, textOptions ) );
    this.addMajorTick( 3, new RichText( `${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 4, new RichText( `2${FMWSymbols.pi}`, textOptions ) );

    // Keep k1 and k1Index in sync
    k1Property.link( k1 => {
      k1IndexProperty.value = validValues.indexOf( k1 );
    } );
    k1IndexProperty.link( k1Index => {
      k1Property.value = validValues[ k1Index ];
    } );
  }
}

fourierMakingWaves.register( 'K1Control', K1Control );
export default K1Control;
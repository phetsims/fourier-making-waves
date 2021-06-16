// Copyright 2021, University of Colorado Boulder

/**
 * K1Control displays the value of k1 (component spacing), and allows it to be changed via a slider.
 * It sets k1IndexProperty, which is an index into a small set of valid k1 values.
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

class K1Control extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {DerivedProperty} k1Property
   * @param {NumberProperty} k1IndexProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, k1Property, k1IndexProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( k1Property instanceof DerivedProperty );
    assert && assert( k1IndexProperty instanceof NumberProperty );

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

    const slider = new K1Slider( k1IndexProperty, {
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

class K1Slider extends Slider {

  /**
   * @param {Property.<number>} k1IndexProperty
   * @param {Object} [options]
   */
  constructor( k1IndexProperty, options ) {

    assert && AssertUtils.assertPropertyOf( k1IndexProperty, 'number' );
    assert && assert( k1IndexProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // Slider options
      constrainValue: value => Utils.roundSymmetric( value ),

      // pdom options - This is selecting an index, not the actual value. And there are only a few indices to chose
      // from, so no need for fine/course control with shift or page modifier keys
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 1
    }, options );

    super( k1IndexProperty, k1IndexProperty.range, options );

    //TODO handle this more robustly, less brute-force
    assert && assert( k1IndexProperty.range.getLength() === 4 );
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 0, new RichText( '0', textOptions ) );
    this.addMajorTick( 1, new RichText( `${FMWSymbols.pi}/4`, textOptions ) );
    this.addMajorTick( 2, new RichText( `${FMWSymbols.pi}/2`, textOptions ) );
    this.addMajorTick( 3, new RichText( `${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 4, new RichText( `2${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'K1Control', K1Control );
export default K1Control;
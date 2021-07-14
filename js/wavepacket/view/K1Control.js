// Copyright 2021, University of Colorado Boulder

/**
 * K1Control displays the value of k1 (component spacing), and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };
const DECIMALS = 2;

class K1Control extends NumberControl {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} k1Property
   * @param {Object} [options]
   */
  constructor( domainProperty, k1Property, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( k1Property instanceof NumberProperty );
    assert && assert( k1Property.range );

    options = merge( {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, {

      // NumberDisplay options
      delta: 1, // because the control is setting an index
      numberDisplayOptions: {
        numberFormatter: k1Index => numberFormatter( k1Property.validValues[ k1Index ], domainProperty.value )
      },

      // Slider options
      sliderOptions: {
        constrainValue: value => Utils.roundSymmetric( value ),

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        majorTicks: [
          { value: 0, label: new RichText( '0', TEXT_OPTIONS ) },
          { value: 1, label: new RichText( `${FMWSymbols.pi}/4`, TEXT_OPTIONS ) },
          { value: 2, label: new RichText( `${FMWSymbols.pi}/2`, TEXT_OPTIONS ) },
          { value: 3, label: new RichText( `${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 4, label: new RichText( `2${FMWSymbols.pi}`, TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: 1 // This is selecting an index, not the actual value.
      },

      // phet-io options
      tandem: Tandem.REQUIRED
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
    assert && assert( k1IndexProperty.range.min === 0 && k1IndexProperty.range.max === 4,
      'implementation of tick marks is dependent on a specific range' );

    // Keep k1 and k1Index in sync
    k1Property.link( k1 => {
      k1IndexProperty.value = validValues.indexOf( k1 );
    } );
    k1IndexProperty.link( k1Index => {
      k1Property.value = validValues[ k1Index ];
    } );

    super( '', k1IndexProperty, k1IndexProperty.range, options );

    // Update the displayed value.
    domainProperty.link( () => this.redrawNumberDisplay() );
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

/**
 * Formats the number for display by NumberDisplay.
 * @param {number} k1
 * @param {Domain} domain
 * @returns {string}
 */
function numberFormatter( k1, domain ) {

  const symbol = StringUtils.fillIn( '{{symbol}}<sub>1</sub>', {
    symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
  } );

  const value = Utils.toFixedNumber( k1, DECIMALS );

  const units = ( domain === Domain.SPACE ) ?
                fourierMakingWavesStrings.units.radiansPerMeter :
                fourierMakingWavesStrings.units.radiansPerMillisecond;

  return StringUtils.fillIn( fourierMakingWavesStrings.symbolValueUnits, {
    symbol: symbol,
    value: value,
    units: units
  } );
}

fourierMakingWaves.register( 'K1Control', K1Control );
export default K1Control;
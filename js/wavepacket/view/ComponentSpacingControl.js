// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingControl controls the value of Fourier component spacing (k1 or omega1).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWNumberControl from '../../common/view/FMWNumberControl.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };
const DECIMALS = 2;

class ComponentSpacingControl extends FMWNumberControl {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} componentSpacingProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, componentSpacingProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( componentSpacingProperty instanceof NumberProperty );
    assert && assert( componentSpacingProperty.range );

    options = merge( {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, {

      // NumberDisplay options
      delta: 1, // because the control is setting an index
      numberDisplayOptions: {
        numberFormatter: componentSpacingIndex =>
          numberFormatter( componentSpacingProperty.validValues[ componentSpacingIndex ], domainProperty.value )
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

    // componentSpacingProperty has a small set of valid values. Only those values are to be settable via this Slider,
    // and they are to be distributed at equally-space tick marks on the Slider. So we create an index into this set
    // of values, and control that index with the Slider.
    const validValues = componentSpacingProperty.validValues;
    const defaultIndex = validValues.indexOf( componentSpacingProperty.value );
    const componentSpacingIndexProperty = new NumberProperty( defaultIndex, {
      numberType: 'Integer',
      range: new Range( 0, validValues.length - 1 )
    } );
    assert && assert( componentSpacingIndexProperty.range.min === 0 && componentSpacingIndexProperty.range.max === 4,
      'implementation of tick marks is dependent on a specific range' );

    // Keep componentSpacing and componentSpacingIndex in sync
    componentSpacingProperty.link( componentSpacing => {
      componentSpacingIndexProperty.value = validValues.indexOf( componentSpacing );
    } );
    componentSpacingIndexProperty.link( componentSpacingIndex => {
      componentSpacingProperty.value = validValues[ componentSpacingIndex ];
    } );

    super( '', componentSpacingIndexProperty, options );

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
 * @param {number} componentSpacing
 * @param {Domain} domain
 * @returns {string}
 */
function numberFormatter( componentSpacing, domain ) {
  assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

  const symbol = StringUtils.fillIn( '{{symbol}}<sub>1</sub>', {
    symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
  } );

  // Using toFixedNumber removes trailing zeros.
  const value = Utils.toFixedNumber( componentSpacing, DECIMALS );

  const units = ( domain === Domain.SPACE ) ?
                fourierMakingWavesStrings.units.radiansPerMeter :
                fourierMakingWavesStrings.units.radiansPerMillisecond;

  return StringUtils.fillIn( fourierMakingWavesStrings.symbolValueUnits, {
    symbol: symbol,
    value: value,
    units: units
  } );
}

fourierMakingWaves.register( 'ComponentSpacingControl', ComponentSpacingControl );
export default ComponentSpacingControl;
// Copyright 2021, University of Colorado Boulder

/**
 * StandardDeviationControl controls the standard deviation, a measure of the wave packet's width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketNumberControl from './WavePacketNumberControl.js';

// constants
const DELTA = 0.01;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

class StandardDeviationControl extends WavePacketNumberControl {

  /**
   * @param {NumberProperty} standardDeviationProperty
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( standardDeviationProperty, domainProperty, options ) {

    assert && assert( standardDeviationProperty instanceof NumberProperty );
    assert && assert( standardDeviationProperty.range );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {

      // NumberDisplay options
      delta: DELTA,
      numberDisplayOptions: {
        numberFormatter: standardDeviation => numberFormatter( standardDeviation, domainProperty.value )
      },

      // Slider options
      sliderOptions: {

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        // It was easy to change during development, and is supported by the assertions below.
        majorTicks: [
          { value: Math.PI, label: new RichText( `${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 2 * Math.PI, label: new RichText( `2${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 3 * Math.PI, label: new RichText( `3${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 4 * Math.PI, label: new RichText( `4${FMWSymbols.pi}`, TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: Math.PI / 4,
        // shiftKeyboardStep is set to options.delta by NumberControl
        pageKeyboardStep: Math.PI / 2
      }
    }, options );

    assert && assert( _.every( options.sliderOptions.majorTicks, tick => standardDeviationProperty.range.contains( tick.value ) ),
      'a tick mark is out of range' );
    assert && assert( options.sliderOptions.majorTicks[ 0 ].value === standardDeviationProperty.range.min,
      'first tick must me range.min' );
    assert && assert( options.sliderOptions.majorTicks[ options.sliderOptions.majorTicks.length - 1 ].value === standardDeviationProperty.range.max,
      'last tick must be range.max' );

    super( standardDeviationProperty, domainProperty, options );
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
 * Formats the number for display by NumberDisplay, invoked when this.redrawNumberDisplay is called.
 * @param {number} standardDeviation
 * @param {Domain} domain
 * @returns {string}
 */
function numberFormatter( standardDeviation, domain ) {
  assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

  const symbol = StringUtils.fillIn( '{{symbol}}<sub>{{subscript}}</sub>', {
    symbol: FMWSymbols.sigma,
    subscript: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
  } );

  // Using toFixedNumber removes trailing zeros.
  const value = Utils.toFixedNumber( standardDeviation, DECIMALS );

  const units = ( domain === Domain.SPACE ) ?
                fourierMakingWavesStrings.units.radiansPerMeter :
                fourierMakingWavesStrings.units.radiansPerMillisecond;

  return StringUtils.fillIn( fourierMakingWavesStrings.symbolValueUnits, {
    symbol: symbol,
    value: value,
    units: units
  } );
}

fourierMakingWaves.register( 'StandardDeviationControl', StandardDeviationControl );
export default StandardDeviationControl;
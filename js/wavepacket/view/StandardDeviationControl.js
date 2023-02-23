// Copyright 2021-2023, University of Colorado Boulder

/**
 * StandardDeviationControl controls the standard deviation, a measure of the wave packet's width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WavePacketNumberControl from './WavePacketNumberControl.js';

// constants
const DELTA = 0.01;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

export default class StandardDeviationControl extends WavePacketNumberControl {

  /**
   * @param {NumberProperty} standardDeviationProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( standardDeviationProperty, domainProperty, options ) {

    assert && assert( standardDeviationProperty instanceof NumberProperty );
    assert && assert( domainProperty instanceof EnumerationProperty );

    options = merge( {

      // NumberDisplay options
      delta: DELTA,

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

    // Set the numberFormatter for this control's NumberDisplay.
    // In addition to the domain, this is dependent on a number of localized string Properties.
    Multilink.multilink( [
        domainProperty,
        FMWSymbols.sigmaStringProperty,
        FMWSymbols.kStringProperty,
        FMWSymbols.omegaStringProperty,
        FourierMakingWavesStrings.units.radiansPerMeterStringProperty,
        FourierMakingWavesStrings.units.radiansPerMillisecondStringProperty,
        FourierMakingWavesStrings.symbolValueUnitsStringProperty
      ],
      ( domain, sigma, k, omega, radiansPerMeter, radiansPerMillisecond, symbolValueUnits ) => {
        assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

        this.setNumberFormatter( standardDeviation => {

          const symbol = StringUtils.fillIn( '{{symbol}}<sub>{{subscript}}</sub>', {
            symbol: sigma,
            subscript: ( domain === Domain.SPACE ) ? k : omega
          } );

          // Using toFixedNumber removes trailing zeros.
          const value = Utils.toFixedNumber( standardDeviation, DECIMALS );

          const units = ( domain === Domain.SPACE ) ? radiansPerMeter : radiansPerMillisecond;

          return StringUtils.fillIn( symbolValueUnits, {
            symbol: symbol,
            value: value,
            units: units
          } );
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

fourierMakingWaves.register( 'StandardDeviationControl', StandardDeviationControl );
// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentSpacingControl controls the value of Fourier component spacing (k1 or omega1).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WavePacketNumberControl from './WavePacketNumberControl.js';

// constants
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };
const DECIMALS = 2;

export default class ComponentSpacingControl extends WavePacketNumberControl {

  /**
   * @param {NumberProperty} componentSpacingProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( componentSpacingProperty, domainProperty, options ) {

    assert && assert( componentSpacingProperty instanceof NumberProperty );
    assert && assert( componentSpacingProperty.validValues );
    assert && assert( domainProperty instanceof EnumerationProperty );

    options = merge( {

      // NumberDisplay options
      delta: 1, // because the control is setting an index

      // Slider options
      sliderOptions: {
        constrainValue: value => Utils.roundSymmetric( value ),

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        // It was easy to change during development, and is supported by assertions below.
        majorTicks: [
          { value: 0, label: new RichText( '0', TEXT_OPTIONS ) },
          { value: 1, label: new RichText( `${FMWSymbols.pi}/4`, TEXT_OPTIONS ) },
          { value: 2, label: new RichText( `${FMWSymbols.pi}/2`, TEXT_OPTIONS ) },
          { value: 3, label: new RichText( `${FMWSymbols.pi}`, TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: 1, // This is selecting an index, not the actual value.
        // shiftKeyboardStep is set to options.delta by NumberControl
        pageKeyboardStep: 1
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
    assert && assert( options.sliderOptions.majorTicks.length === validValues.length,
      'a tick is required for each value in validValues' );

    // Keep componentSpacing and componentSpacingIndex in sync
    componentSpacingProperty.link( componentSpacing => {
      componentSpacingIndexProperty.value = validValues.indexOf( componentSpacing );
    } );
    componentSpacingIndexProperty.link( componentSpacingIndex => {
      componentSpacingProperty.value = validValues[ componentSpacingIndex ];
    } );

    super( componentSpacingIndexProperty, domainProperty, options );

    // Set the numberFormatter for this control's NumberDisplay.
    // In addition to the domain, this is dependent on a number of localized string Properties.
    Multilink.multilink( [
        domainProperty,
        FMWSymbols.kStringProperty,
        FMWSymbols.omegaStringProperty,
        FourierMakingWavesStrings.units.radiansPerMeterStringProperty,
        FourierMakingWavesStrings.units.radiansPerMillisecondStringProperty,
        FourierMakingWavesStrings.symbolValueUnitsStringProperty
      ],
      ( domain, k, omega, radiansPerMeter, radiansPerMillisecond, symbolValueUnits ) => {
        assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

        this.setNumberFormatter( componentSpacingIndex => {

          const componentSpacing = componentSpacingProperty.validValues[ componentSpacingIndex ];

          const symbol = StringUtils.fillIn( '{{symbol}}<sub>1</sub>', {
            symbol: ( domain === Domain.SPACE ) ? k : omega
          } );

          // Using toFixedNumber removes trailing zeros.
          const value = Utils.toFixedNumber( componentSpacing, DECIMALS );

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

fourierMakingWaves.register( 'ComponentSpacingControl', ComponentSpacingControl );
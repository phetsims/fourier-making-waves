// Copyright 2021-2024, University of Colorado Boulder

/**
 * StandardDeviationControl controls the standard deviation, a measure of the wave packet's width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
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
const DELTA = 0.01;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

export default class StandardDeviationControl extends WavePacketNumberControl {

  public constructor( standardDeviationProperty: NumberProperty,
                      domainProperty: EnumerationProperty<Domain>,
                      tandem: Tandem ) {

    const options = {

      delta: DELTA,

      // Slider options
      sliderOptions: {

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        // It was easy to change during development, and is supported by the assertions below.
        majorTicks: [
          { value: Math.PI, label: new RichText( `${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) },
          { value: 2 * Math.PI, label: new RichText( `2${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) },
          { value: 3 * Math.PI, label: new RichText( `3${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) },
          { value: 4 * Math.PI, label: new RichText( `4${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: Math.PI / 4,
        // shiftKeyboardStep is set to options.delta by NumberControl
        pageKeyboardStep: Math.PI / 2
      },

      numberDisplayOptions: {
        numberFormatter: ( standardDeviation: number ) => {
          const domain = domainProperty.value;
          assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

          const symbol = StringUtils.fillIn( '{{symbol}}<sub>{{subscript}}</sub>', {
            symbol: FMWSymbols.sigmaMarkupStringProperty.value,
            subscript: ( domain === Domain.SPACE ) ? FMWSymbols.kMarkupStringProperty.value : FMWSymbols.omegaMarkupStringProperty.value
          } );

          // Using toFixedNumber removes trailing zeros.
          const value = Utils.toFixedNumber( standardDeviation, DECIMALS );

          const units = ( domain === Domain.SPACE ) ?
                        FourierMakingWavesStrings.units.radiansPerMeterStringProperty.value :
                        FourierMakingWavesStrings.units.radiansPerMillisecondStringProperty.value;

          return StringUtils.fillIn( FourierMakingWavesStrings.symbolValueUnitsStringProperty, {
            symbol: symbol,
            value: value,
            units: units
          } );
        },

        // Properties that are used in numberFormatter
        numberFormatterDependencies: [
          domainProperty,
          FMWSymbols.sigmaMarkupStringProperty,
          FMWSymbols.kMarkupStringProperty,
          FMWSymbols.omegaMarkupStringProperty,
          FourierMakingWavesStrings.units.radiansPerMeterStringProperty,
          FourierMakingWavesStrings.units.radiansPerMillisecondStringProperty,
          FourierMakingWavesStrings.symbolValueUnitsStringProperty
        ]
      },

      // phet-io
      tandem: tandem
    };

    assert && assert( _.every( options.sliderOptions.majorTicks, tick => standardDeviationProperty.range.contains( tick.value ) ),
      'a tick mark is out of range' );
    assert && assert( options.sliderOptions.majorTicks[ 0 ].value === standardDeviationProperty.range.min,
      'first tick must me range.min' );
    assert && assert( options.sliderOptions.majorTicks[ options.sliderOptions.majorTicks.length - 1 ].value === standardDeviationProperty.range.max,
      'last tick must be range.max' );

    super( standardDeviationProperty, domainProperty, options );
  }
}

fourierMakingWaves.register( 'StandardDeviationControl', StandardDeviationControl );
// Copyright 2021-2024, University of Colorado Boulder

/**
 * CenterControl controls the wave packet's center (k0 or omega0).
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
const DELTA = Math.PI / 4;
const DECIMALS = 1;
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

export default class CenterControl extends WavePacketNumberControl {

  public constructor( centerProperty: NumberProperty, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    super( centerProperty, domainProperty, {

      delta: DELTA,

      // Slider options
      sliderOptions: {

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        majorTicks: [
          { value: 9 * Math.PI, label: new RichText( `9${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) },
          { value: 12 * Math.PI, label: new RichText( `12${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) },
          { value: 15 * Math.PI, label: new RichText( `15${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) }
        ],
        minorTickSpacing: Math.PI,

        // pdom options
        keyboardStep: Math.PI / 2,
        // shiftKeyboardStep is set to options.delta by NumberControl
        pageKeyboardStep: Math.PI
      },

      numberDisplayOptions: {
        numberFormatter: center => {
          const domain = domainProperty.value;
          assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

          const symbol = StringUtils.fillIn( '{{symbol}}<sub>0</sub>', {
            symbol: ( domain === Domain.SPACE ) ? FMWSymbols.kMarkupStringProperty.value : FMWSymbols.omegaMarkupStringProperty.value
          } );

          // Using toFixedNumber removes trailing zeros.
          const value = Utils.toFixedNumber( center, DECIMALS );

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
          FMWSymbols.kMarkupStringProperty,
          FMWSymbols.omegaMarkupStringProperty,
          FourierMakingWavesStrings.units.radiansPerMeterStringProperty,
          FourierMakingWavesStrings.units.radiansPerMillisecondStringProperty,
          FourierMakingWavesStrings.symbolValueUnitsStringProperty
        ]
      },

      // phet-io
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'CenterControl', CenterControl );
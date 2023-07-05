// Copyright 2021-2023, University of Colorado Boulder

/**
 * ConjugateStandardDeviationControl controls the conjugate standard deviation, a measure of the wave packet's width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
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
const DELTA = 0.001;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

export default class ConjugateStandardDeviationControl extends WavePacketNumberControl {

  public constructor( conjugateStandardDeviationProperty: NumberProperty,
                      domainProperty: EnumerationProperty<Domain>,
                      tandem: Tandem ) {

    const options = {

      // NumberDisplay options
      delta: DELTA,
      numberDisplayOptions: {
        minBackgroundWidth: 140
      },

      // Slider options
      sliderOptions: {

        // Default pointer area for slider overlaps WidthIndicatorsCheckbox.
        // We can't eliminate this overlap because we can't afford to add vertical space. So do our best to mitigate
        // the issue by shrinking the slider's touchArea. It would be nicer if we could shift the slider's touchArea
        // up, but that isn't supported by the Slider API.
        // See https://github.com/phetsims/fourier-making-waves/issues/124#issuecomment-897229707
        thumbTouchAreaYDilation: 5,

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        // It was easy to change during development, and is supported by the assertions below.
        majorTicks: [
          { value: 1 / ( 4 * Math.PI ), label: new RichText( `1/(4${FMWSymbols.piMarkup})`, TEXT_OPTIONS ) },
          { value: 1 / ( 2 * Math.PI ), label: new RichText( `1/(2${FMWSymbols.piMarkup})`, TEXT_OPTIONS ) },
          { value: 1 / Math.PI, label: new RichText( `1/${FMWSymbols.piMarkup}`, TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: 0.01,
        // shiftKeyboardStep is set to options.delta by NumberControl
        pageKeyboardStep: 0.02
      },

      // phet-io
      tandem: tandem
    };

    assert && assert( _.every( options.sliderOptions.majorTicks, tick => conjugateStandardDeviationProperty.range.contains( tick.value ) ),
      'a tick mark is out of range' );
    assert && assert( options.sliderOptions.majorTicks[ 0 ].value === conjugateStandardDeviationProperty.range.min,
      'first tick must me range.min' );
    assert && assert( options.sliderOptions.majorTicks[ options.sliderOptions.majorTicks.length - 1 ].value === conjugateStandardDeviationProperty.range.max,
      'last tick must be range.max' );

    super( conjugateStandardDeviationProperty, domainProperty, options );

    // Set the numberFormatter for this control's NumberDisplay.
    // In addition to the domain, this is dependent on a number of localized string Properties.
    Multilink.multilink( [
      domainProperty,
      FMWSymbols.sigmaMarkupStringProperty,
      FMWSymbols.xMarkupStringProperty,
      FMWSymbols.tMarkupStringProperty,
      FMWSymbols.kMarkupStringProperty,
      FMWSymbols.omegaMarkupStringProperty,
      FourierMakingWavesStrings.units.metersStringProperty,
      FourierMakingWavesStrings.units.millisecondsStringProperty,
      FourierMakingWavesStrings.symbolSymbolValueUnitsStringProperty
    ], ( domain, sigma, x, t, k, omega, meters, milliseconds, symbolSymbolValueUnits ) => {
      assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

      this.setNumberFormatter( conjugateStandardDeviation => {

        const pattern = `${sigma}<sub>{{subscript}}</sub>`;
        const symbol1 = StringUtils.fillIn( pattern, {
          subscript: ( domain === Domain.SPACE ) ? x : t
        } );
        const symbol2 = StringUtils.fillIn( pattern, {
          subscript: ( domain === Domain.SPACE ) ? k : omega
        } );

        // Using toFixedNumber removes trailing zeros.
        const value = Utils.toFixedNumber( conjugateStandardDeviation, DECIMALS );

        const units = ( domain === Domain.SPACE ) ? meters : milliseconds;

        return StringUtils.fillIn( symbolSymbolValueUnits, {
          symbol1: symbol1,
          symbol2: symbol2,
          value: value,
          units: units
        } );
      } );
    } );
  }
}

fourierMakingWaves.register( 'ConjugateStandardDeviationControl', ConjugateStandardDeviationControl );
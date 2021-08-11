// Copyright 2021, University of Colorado Boulder

/**
 * StandardDeviationControl controls the standard deviation, a measure of the wave packet's width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
const DELTA = 0.01;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

class StandardDeviationControl extends FMWNumberControl {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} standardDeviationProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, standardDeviationProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( standardDeviationProperty instanceof NumberProperty );
    assert && assert( standardDeviationProperty.range );

    options = merge( {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, {

      // NumberDisplay options
      delta: DELTA,
      numberDisplayOptions: {
        numberFormatter: standardDeviation => numberFormatter( standardDeviation, domainProperty.value )
      },

      // Slider options
      sliderOptions: {

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        majorTicks: [
          { value: 1, label: new RichText( '1', TEXT_OPTIONS ) },
          { value: Math.PI, label: new RichText( `${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 2 * Math.PI, label: new RichText( `2${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 3 * Math.PI, label: new RichText( `3${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 4 * Math.PI, label: new RichText( `4${FMWSymbols.pi}`, TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: 1
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( '', standardDeviationProperty, options );

    // Update the displayed value.
    domainProperty.link( () => this.redrawNumberDisplay() );

    // @public {DerivedProperty.<boolean>} Whether the user is interacting with this control.
    // This is used to ensure that interaction with StandardDeviationControl and ConjugateStandardDeviationControl
    // is mutually exclusive.
    this.isPressedProperty = new DerivedProperty(
      [ this.slider.thumbDragListener.isPressedProperty, this.slider.trackDragListener.isPressedProperty ],
      ( thumbIsPressed, trackIsPressed ) => ( thumbIsPressed || trackIsPressed ) );
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
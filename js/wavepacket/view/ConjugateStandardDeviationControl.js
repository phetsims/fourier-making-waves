// Copyright 2021, University of Colorado Boulder

/**
 * ConjugateStandardDeviationControl controls the conjugate standard deviation, a measure of the wave packet's width.
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
const DELTA = 0.001;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

class ConjugateStandardDeviationControl extends FMWNumberControl {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} conjugateStandardDeviationProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, conjugateStandardDeviationProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( conjugateStandardDeviationProperty instanceof NumberProperty );
    assert && assert( conjugateStandardDeviationProperty.range );

    options = merge( {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, {

      // NumberDisplay options
      delta: DELTA,
      numberDisplayOptions: {
        minBackgroundWidth: 140,
        numberFormatter: conjugateStandardDeviation => numberFormatter( conjugateStandardDeviation, domainProperty.value )
      },

      // Slider options
      sliderOptions: {

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        majorTicks: [
          { value: 1 / ( 4 * Math.PI ), label: new RichText( `1/(4${FMWSymbols.pi})`, TEXT_OPTIONS ) },
          { value: 1 / Math.PI, label: new RichText( `1/${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 1, label: new RichText( '1', TEXT_OPTIONS ) }
        ],

        // pdom options
        keyboardStep: 0.01
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( '', conjugateStandardDeviationProperty, options );

    // Update the displayed value.
    domainProperty.link( () => this.redrawNumberDisplay() );

    // @public {DerivedProperty.<boolean>} Whether the user is interacting with this control.
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
 * Formats the number for display by NumberDisplay.
 * @param {number} conjugateStandardDeviation
 * @param {Domain} domain
 * @returns {string}
 */
function numberFormatter( conjugateStandardDeviation, domain ) {

  const pattern = `${FMWSymbols.sigma}<sub>{{subscript}}</sub>`;
  const symbol1 = StringUtils.fillIn( pattern, {
    subscript: ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t
  } );
  const symbol2 = StringUtils.fillIn( pattern, {
    subscript: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
  } );

  // Using toFixedNumber removes trailing zeros.
  const value = Utils.toFixedNumber( conjugateStandardDeviation, DECIMALS );

  const units = ( domain === Domain.SPACE ) ?
                fourierMakingWavesStrings.units.meters :
                fourierMakingWavesStrings.units.milliseconds;

  return StringUtils.fillIn( fourierMakingWavesStrings.symbolSymbolValueUnits, {
    symbol1: symbol1,
    symbol2: symbol2,
    value: value,
    units: units
  } );
}

fourierMakingWaves.register( 'ConjugateStandardDeviationControl', ConjugateStandardDeviationControl );
export default ConjugateStandardDeviationControl;
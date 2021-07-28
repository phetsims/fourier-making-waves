// Copyright 2021, University of Colorado Boulder

/**
 * K0Control displays the value of k0 (the wave packet's center) and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
const DELTA = 0.1;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

class K0Control extends NumberControl {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} centerProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, centerProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( centerProperty instanceof NumberProperty );
    assert && assert( centerProperty.range );

    options = merge( {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, {

      // NumberDisplay options
      delta: Math.PI / 4,
      numberDisplayOptions: {
        numberFormatter: center => numberFormatter( center, domainProperty.value )
      },

      // Slider options
      sliderOptions: {

        // Add symbolic tick marks. This is more hard-coded than I'd prefer, but is clear and straightforward.
        majorTicks: [
          { value: 9 * Math.PI, label: new RichText( `9${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 12 * Math.PI, label: new RichText( `12${FMWSymbols.pi}`, TEXT_OPTIONS ) },
          { value: 15 * Math.PI, label: new RichText( `15${FMWSymbols.pi}`, TEXT_OPTIONS ) }
        ],
        minorTickSpacing: Math.PI,

        // pdom options
        keyboardStep: 1
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( '', centerProperty, centerProperty.range, options );

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
 * @param {number} center
 * @param {Domain} domain
 * @returns {string}
 */
function numberFormatter( center, domain ) {

  const symbol = StringUtils.fillIn( '{{symbol}}<sub>0</sub>', {
    symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
  } );

  const value = Utils.toFixedNumber( center, DECIMALS );

  const units = ( domain === Domain.SPACE ) ?
                fourierMakingWavesStrings.units.radiansPerMeter :
                fourierMakingWavesStrings.units.radiansPerMillisecond;

  return StringUtils.fillIn( fourierMakingWavesStrings.symbolValueUnits, {
    symbol: symbol,
    value: value,
    units: units
  } );
}

fourierMakingWaves.register( 'K0Control', K0Control );
export default K0Control;
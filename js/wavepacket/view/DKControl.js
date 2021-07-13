// Copyright 2021, University of Colorado Boulder

/**
 * DKControl displays the wave packet's dk value, and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
const DELTA = 0.01;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

class DKControl extends NumberControl {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} dkProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, dkProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( dkProperty instanceof NumberProperty );
    assert && assert( dkProperty.range );

    options = merge( {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, {

      // NumberDisplay options
      delta: DELTA,
      numberDisplayOptions: {
        numberFormatter: dk =>
          StringUtils.fillIn( fourierMakingWavesStrings.symbolEqualsValueUnits, {
            symbol: StringUtils.fillIn( '{{symbol}}<sub>{{subscript}}</sub>', {
              symbol: FMWSymbols.sigma,
              subscript: ( domainProperty.value === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
            } ),
            value: Utils.toFixedNumber( dk, DECIMALS ),
            units: ( domainProperty.value === Domain.SPACE ) ?
                   fourierMakingWavesStrings.units.radiansPerMeter :
                   fourierMakingWavesStrings.units.radiansPerMillisecond
          } )
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

    super( '', dkProperty, dkProperty.range, options );

    // Update the displayed value.
    domainProperty.link( () => this.redrawNumberDisplay() );

    //TODO only update when released
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

fourierMakingWaves.register( 'DKControl', DKControl );
export default DKControl;
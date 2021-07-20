// Copyright 2021, University of Colorado Boulder

/**
 * DXControl displays the wave packet's dx value, and allows it to be changed via a slider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
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
const DELTA = 0.001;
const DECIMALS = Utils.numberOfDecimalPlaces( DELTA );
const TEXT_OPTIONS = { font: FMWConstants.TICK_LABEL_FONT };

class DXControl extends NumberControl {

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
        minBackgroundWidth: 140,
        numberFormatter: dx => numberFormatter( dx, domainProperty.value )
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

    // dxProperty serves as an adapter Property that allows us to change dkProperty. dk * dx = 1, so dx = 1 / dk.
    // We define this Property here, rather than in the model, so that this is certain to be the only control
    // directly modifying this Property, we don't have to consider reentrancy, etc. And this is the only place
    // in the simulation where dxProperty is needed. See https://github.com/phetsims/fourier-making-waves/issues/106.
    const dxProperty = new NumberProperty( 1 / dkProperty.value, {
      reentrant: true, //TODO
      range: new Range( 1 / dkProperty.range.max, 1 / dkProperty.range.min ),
      tandem: options.tandem.createTandem( 'dxProperty' )
    } );

    // Keep dk and dx synchronized, while avoiding reentrant behavior.
    let isSynchronizing = false;
    dkProperty.lazyLink( dk => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        dxProperty.value = 1 / dk;
        isSynchronizing = false;
      }
    } );
    dxProperty.lazyLink( dx => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        dkProperty.value = 1 / dx;
        isSynchronizing = false;
      }
    } );

    super( '', dxProperty, dxProperty.range, options );

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

/**
 * Formats the number for display by NumberDisplay.
 * @param {number} dx
 * @param {Domain} domain
 * @returns {string}
 */
function numberFormatter( dx, domain ) {

  const pattern = `${FMWSymbols.sigma}<sub>{{subscript}}</sub>`;
  const symbol1 = StringUtils.fillIn( pattern, {
    subscript: ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t
  } );
  const symbol2 = StringUtils.fillIn( pattern, {
    subscript: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega
  } );

  const value = Utils.toFixedNumber( dx, DECIMALS );

  const units = ( domain === Domain.SPACE ) ?
                fourierMakingWavesStrings.units.radiansPerMeter :
                fourierMakingWavesStrings.units.radiansPerMillisecond;

  return StringUtils.fillIn( fourierMakingWavesStrings.symbolSymbolValueUnits, {
    symbol1: symbol1,
    symbol2: symbol2,
    value: value,
    units: units
  } );
}

fourierMakingWaves.register( 'DXControl', DXControl );
export default DXControl;
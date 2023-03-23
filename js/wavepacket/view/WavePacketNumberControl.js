// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketNumberControl is the base class for NumberControls in the Wave Packet screen.
 * It adds interactive tick labels, isPressedProperty, and synchronizes its display with the Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import { FireListener } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class WavePacketNumberControl extends NumberControl {

  /**
   * @param {NumberProperty} numberProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( numberProperty, domainProperty, options ) {
    assert && assert( numberProperty instanceof NumberProperty );
    assert && assert( domainProperty instanceof EnumerationProperty );

    //TODO https://github.com/phetsims/fourier-making-waves/issues/56 add Slider sound
    options = merge( {
      tandem: Tandem.REQUIRED
    }, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, options );

    // The layoutFunction doesn't use the title, so provide empty string.
    super( '', numberProperty, numberProperty.range, options );

    // Make tick label interactive, so that pressing on a tick label sets the Property to that value.
    if ( options.sliderOptions && options.sliderOptions.majorTicks ) {
      options.sliderOptions.majorTicks.forEach( majorTick => {
        if ( majorTick.label ) {

          const value = majorTick.value;
          const label = majorTick.label;

          // Pressing on a tick's label sets the Property to the value of that tick.
          label.addInputListener( new FireListener( {
            fire: () => { numberProperty.value = value; }
          } ) );

          //TODO https://github.com/phetsims/sun/issues/712 workaround to support interactive tick labels
          label.pickable = true;
        }
      } );
    }

    // @public {DerivedProperty.<boolean>} Whether the user is interacting with this control.
    // This is used to ensure that some controls are mutually exclusive. For example,
    // StandardDeviationControl and ConjugateStandardDeviationControl cannot be used at the same time.
    this.isPressedProperty = new DerivedProperty(
      [ this.slider.thumbDragListener.isPressedProperty, this.slider.trackDragListener.isPressedProperty ],
      ( thumbIsPressed, trackIsPressed ) => ( thumbIsPressed || trackIsPressed ) );

    // Subclasses generally provide options.numberDisplayOptions.numberFormatter which tailors the value display to
    // the domain. So when the domain changes, this will cause NumberControl tell its NumberDisplay to call
    // that numberFormatter.
    domainProperty.link( () => this.redrawNumberDisplay() );
  }
}

fourierMakingWaves.register( 'WavePacketNumberControl', WavePacketNumberControl );
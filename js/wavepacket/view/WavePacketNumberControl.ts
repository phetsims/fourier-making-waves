// Copyright 2021-2024, University of Colorado Boulder

/**
 * WavePacketNumberControl is the base class for NumberControls in the Wave Packet screen.
 * It adds interactive tick labels, isPressedProperty, and synchronizes its display with the Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { FireListener } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

type SelfOptions = EmptySelfOptions;

export type WavePacketNumberControlOptions = SelfOptions & NumberControlOptions &
  PickRequired<NumberControlOptions, 'tandem'>;

export default class WavePacketNumberControl extends NumberControl {

  // Whether the user is interacting with this control.
  // This is used to ensure that some controls are mutually exclusive. For example,
  // StandardDeviationControl and ConjugateStandardDeviationControl cannot be used at the same time.
  public readonly isPressedProperty: TReadOnlyProperty<boolean>;

  protected constructor( numberProperty: NumberProperty,
                         domainProperty: EnumerationProperty<Domain>,
                         providedOptions: WavePacketNumberControlOptions ) {

    const options = optionize3<WavePacketNumberControlOptions, SelfOptions, NumberControlOptions>()(
      {}, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, providedOptions );

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
            fire: () => { numberProperty.value = value; },
            tandem: Tandem.OPT_OUT
          } ) );

          //TODO https://github.com/phetsims/sun/issues/712 workaround to support interactive tick labels
          label.pickable = true;
        }
      } );
    }

    this.isPressedProperty = new DerivedProperty(
      [ this.slider.thumbDragListener.isPressedProperty, this.slider.trackDragListener.isPressedProperty ],
      ( thumbIsPressed, trackIsPressed ) => ( thumbIsPressed || trackIsPressed ) );
  }
}

fourierMakingWaves.register( 'WavePacketNumberControl', WavePacketNumberControl );
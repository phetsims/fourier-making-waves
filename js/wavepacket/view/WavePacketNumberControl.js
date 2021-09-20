// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketNumberControl is the base class for NumberControls in the Wave Packet screen.
 * It adds interactive tick labels, isPressedProperty, and synchronizes its display with the Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../../common/FMWConstants.js';

class WavePacketNumberControl extends NumberControl {

  /**
   * @param {NumberProperty} numberProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( numberProperty, domainProperty, options ) {
    assert && assert( numberProperty instanceof NumberProperty );
    assert && assert( numberProperty.range );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    //TODO https://github.com/phetsims/fourier-making-waves/issues/56 add Slider sound
    options = merge( {
      tandem: Tandem.REQUIRED
    }, FMWConstants.WAVE_PACKET_NUMBER_CONTROL_OPTIONS, options );

    //REVIEW: Looks like the layoutFunction doesn't use the title, is that why the empty-string is passed here?
    super( '' /* title */, numberProperty, numberProperty.range, options );

    // Make tick label interactive, so that pressing on a tick label sets the Property to that value.
    if ( options.sliderOptions && options.sliderOptions.majorTicks ) {
      options.sliderOptions.majorTicks.forEach( majorTick => {
        if ( majorTick.label ) {

          const value = majorTick.value;
          const label = majorTick.label;

          // Pressing on a tick's label sets the Property to the value of that tick.
          label.addInputListener( new PressListener( {
            press: () => { numberProperty.value = value; }
          } ) );

          //TODO https://github.com/phetsims/sun/issues/712 workaround to support interactive tick labels
          label.pickable = true;
        }
      } );
    }

    // @public {DerivedProperty.<boolean>} Whether the user is interacting with this control.
    // This is used to ensure ensure that some controls are mutually exclusive. For example,
    // StandardDeviationControl and ConjugateStandardDeviationControl cannot be used at the same time.
    this.isPressedProperty = new DerivedProperty(
      [ this.slider.thumbDragListener.isPressedProperty, this.slider.trackDragListener.isPressedProperty ],
      ( thumbIsPressed, trackIsPressed ) => ( thumbIsPressed || trackIsPressed ) );

    // Update the displayed value.
    //REVIEW: I don't see other dependence on this directly, I presume subtypes do?
    domainProperty.link( () => this.redrawNumberDisplay() );
  }
}

fourierMakingWaves.register( 'WavePacketNumberControl', WavePacketNumberControl );
export default WavePacketNumberControl;
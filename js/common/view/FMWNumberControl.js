// Copyright 2021, University of Colorado Boulder

//TODO When https://github.com/phetsims/sun/issues/712 is addressed, it may be possible to eliminate this class.

//TODO https://github.com/phetsims/sun/issues/697, https://github.com/phetsims/fourier-making-waves/issues/56
// Add sound for this NumberControl's slider when the Slider sound API has been completed.

/**
 * FMWNumberControl is a NumberControl with interactive tick labels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FMWNumberControl extends NumberControl {

  /**
   * @param {string} title
   * @param {NumberProperty} numberProperty
   * @param {Object} [options]
   */
  constructor( title, numberProperty, options ) {
    assert && assert( numberProperty instanceof NumberProperty );
    assert && assert( numberProperty.range );

    super( title, numberProperty, numberProperty.range, options );

    // Make tick label interactive, so that pressing on a tick label sets the Property to that value.
    if ( _.hasIn( options, 'sliderOptions.majorTicks' ) ) {
      options.sliderOptions.majorTicks.forEach( majorTick => {

        const value = majorTick.value;
        const label = majorTick.label;

        // Pressing on a tick's label sets the Property to the value of that tick.
        label.addInputListener( new PressListener( {
          press: () => { numberProperty.value = value; }
        } ) );

        //TODO https://github.com/phetsims/sun/issues/712 workaround, because Slider sets tick labels to pickable:false
        label.pickable = true;
      } );
    }
  }
}

fourierMakingWaves.register( 'FMWNumberControl', FMWNumberControl );
export default FMWNumberControl;
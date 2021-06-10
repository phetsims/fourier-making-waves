// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingSlider is the slider for setting component spacing. It sets componentSpacingIndexProperty,
 * which is an index into a small set of valid spacing values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Slider from '../../../../sun/js/Slider.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ComponentSpacingSlider extends Slider {

  /**
   * @param {Property.<number>} componentSpacingIndexProperty
   * @param {Object} [options]
   */
  constructor( componentSpacingIndexProperty, options ) {

    assert && AssertUtils.assertPropertyOf( componentSpacingIndexProperty, 'number' );
    assert && assert( componentSpacingIndexProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // Slider options
      constrainValue: value => Utils.roundSymmetric( value ),

      // pdom options - only a few indices to chose from so no need for fine/course control with shift or page
      // modifier keys
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 1
    }, options );

    super( componentSpacingIndexProperty, componentSpacingIndexProperty.range, options );

    //TODO handle this more robustly, less brute-force
    assert && assert( componentSpacingIndexProperty.range.getLength() === 4 );
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 0, new RichText( '0', textOptions ) );
    this.addMajorTick( 1, new RichText( `${FMWSymbols.pi}/4`, textOptions ) );
    this.addMajorTick( 2, new RichText( `${FMWSymbols.pi}/2`, textOptions ) );
    this.addMajorTick( 3, new RichText( `${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 4, new RichText( `2${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'ComponentSpacingSlider', ComponentSpacingSlider );
export default ComponentSpacingSlider;
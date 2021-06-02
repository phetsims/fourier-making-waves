// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketKWidthSlider is the slider for setting the wave packet's width in k space.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Slider from '../../../../sun/js/Slider.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketKWidthSlider extends Slider {

  /**
   * @param {Property.<number>} kWidthProperty
   * @param {Object} [options]
   */
  constructor( kWidthProperty, options ) {

    assert && AssertUtils.assertPropertyOf( kWidthProperty, 'number' );
    assert && assert( kWidthProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // pdom options
      //TODO alt input steps
    }, options );

    super( kWidthProperty, kWidthProperty.range, options );

    //TODO handle this more robustly, less brute-force
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 1, new RichText( '1', textOptions ) );
    this.addMajorTick( Math.PI, new RichText( `${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 2 * Math.PI, new RichText( `2${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 3 * Math.PI, new RichText( `3${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 4 * Math.PI, new RichText( `4${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'WavePacketKWidthSlider', WavePacketKWidthSlider );
export default WavePacketKWidthSlider;
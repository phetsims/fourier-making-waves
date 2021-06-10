// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketXWidthSlider is the slider for setting the wave packet's width in x space.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Slider from '../../../../sun/js/Slider.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketXWidthSlider extends Slider {

  /**
   * @param {NumberProperty} xWidthProperty
   * @param {Object} [options]
   */
  constructor( xWidthProperty, options ) {

    assert && assert( xWidthProperty instanceof NumberProperty );
    assert && assert( xWidthProperty.range );

    options = merge( {}, FMWConstants.CONTINUOUS_SLIDER_OPTIONS, {

      // WavePacketXWidthSlider options
      tickDecimals: 3

      // pdom options
      //TODO alt input steps
    }, options );

    super( xWidthProperty, xWidthProperty.range, options );

    //TODO handle this more robustly, less brute-force
    const textOptions = { font: FMWConstants.TICK_LABEL_FONT };
    this.addMajorTick( 1, new RichText( '1', textOptions ) );
    this.addMajorTick( 1 / Math.PI, new RichText( `1/${FMWSymbols.pi}`, textOptions ) );
    this.addMajorTick( 1 / ( 4 * Math.PI ), new RichText( `1/(4${FMWSymbols.pi})`, textOptions ) );
  }
}

fourierMakingWaves.register( 'WavePacketXWidthSlider', WavePacketXWidthSlider );
export default WavePacketXWidthSlider;
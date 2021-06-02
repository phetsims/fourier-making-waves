// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketCenterSlider is the slider for setting the wave packet's center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Slider from '../../../../sun/js/Slider.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketCenterSlider extends Slider {

  /**
   * @param {Property.<number>} wavePacketCenterProperty
   * @param {Object} [options]
   */
  constructor( wavePacketCenterProperty, options ) {

    assert && AssertUtils.assertPropertyOf( wavePacketCenterProperty, 'number' );
    assert && assert( wavePacketCenterProperty.range );

    options = merge( {

      // Slider options
      trackSize: new Dimension2( 175, 3 ),
      thumbSize: new Dimension2( 12, 20 ),
      majorTickLength: 10

      // pdom options
      //TODO alt input steps
    }, options );

    super( wavePacketCenterProperty, wavePacketCenterProperty.range, options );

    //TODO handle this more robustly, less brute-force
    const textOptions = {
      font: new PhetFont( 12 )
    };
    this.addMajorTick( 9 * Math.PI, new RichText( `9${FMWSymbols.pi}`, textOptions ) );
    this.addMinorTick( 10 * Math.PI, new RichText( '', textOptions ) );
    this.addMinorTick( 11 * Math.PI, new RichText( '', textOptions ) );
    this.addMajorTick( 12 * Math.PI, new RichText( `12${FMWSymbols.pi}`, textOptions ) );
    this.addMinorTick( 13 * Math.PI, new RichText( '', textOptions ) );
    this.addMinorTick( 14 * Math.PI, new RichText( '', textOptions ) );
    this.addMajorTick( 15 * Math.PI, new RichText( `15${FMWSymbols.pi}`, textOptions ) );
  }
}

fourierMakingWaves.register( 'WavePacketCenterSlider', WavePacketCenterSlider );
export default WavePacketCenterSlider;
// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketXWidthSlider is the slider for setting the wave packet's width in x space.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Slider from '../../../../sun/js/Slider.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketXWidthSlider extends Slider {

  /**
   * @param {Property.<number>} xWidthProperty
   * @param {Object} [options]
   */
  constructor( xWidthProperty, options ) {

    assert && AssertUtils.assertPropertyOf( xWidthProperty, 'number' );
    assert && assert( xWidthProperty.range );

    options = merge( {

      tickDecimals: 3,

      // Slider options
      trackSize: new Dimension2( 175, 3 ),
      thumbSize: new Dimension2( 12, 20 ),
      majorTickLength: 10

      // pdom options
      //TODO alt input steps
    }, options );

    super( xWidthProperty, xWidthProperty.range, options );

    // Major ticks at min and max, and at 0.2 intervals between min and max
    {
      const tickValues = [];
      tickValues.push( xWidthProperty.range.min, xWidthProperty.range.max );

      assert && assert( xWidthProperty.range.max === 1 );
      const TICK_INTERVAL = 0.2;
      let tickValue = xWidthProperty.range.max - TICK_INTERVAL;
      while ( tickValue > xWidthProperty.range.min ) {
        tickValues.push( tickValue );
        tickValue -= TICK_INTERVAL;
      }

      const textOptions = { font: new PhetFont( 12 ) };
      tickValues.forEach( tickValue =>
        this.addMajorTick( tickValue, new Text( Utils.toFixedNumber( tickValue, options.tickDecimals ), textOptions ) )
      );
    }
  }
}

fourierMakingWaves.register( 'WavePacketXWidthSlider', WavePacketXWidthSlider );
export default WavePacketXWidthSlider;
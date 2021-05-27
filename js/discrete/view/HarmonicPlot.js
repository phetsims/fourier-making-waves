// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicPlot is a specialization of CanvasLinePlot that adds a reference to the associated harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class HarmonicPlot extends CanvasLinePlot {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic} harmonic
   * @param {Property.<Vector2[]>} dataSetProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonic, dataSetProperty, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && assert( harmonic instanceof Harmonic );
    assert && AssertUtils.assertPropertyOf( dataSetProperty, Array );

    options = merge( {}, options );

    assert && assert( !options.stroke, 'HarmonicPlot sets stroke' );
    options.stroke = harmonic.colorProperty.value;

    super( chartTransform, dataSetProperty.value, options );

    // @public (read-only)
    this.harmonic = harmonic;

    // @public (read-only) fires when the plot needs to be redrawn
    this.changedEmitter = new Emitter();

    // Keep synchronized with the data set. unlink is not needed.
    dataSetProperty.lazyLink( dataSet => {
      this.setDataSet( dataSet );
      this.changedEmitter.emit();
    } );

    // Keep the plot's stroke in sync with the harmonic's color. Harmonic colors can be changed via
    // fourier-making-waves-colors.html, or (perhaps in the future) via PHET-iO.
    // unlink is not needed.
    harmonic.colorProperty.lazyLink( color => {
      this.setStroke( color );
      this.changedEmitter.emit();
    } );

    // Hide the plot when its amplitude is zero.
    harmonic.amplitudeProperty.link( amplitude => {
      this.visible = ( amplitude !== 0 );
    } );
  }
}

fourierMakingWaves.register( 'HarmonicPlot', HarmonicPlot );
export default HarmonicPlot;
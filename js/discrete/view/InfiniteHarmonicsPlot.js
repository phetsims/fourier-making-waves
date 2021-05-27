// Copyright 2021, University of Colorado Boulder

/**
 * InfiniteHarmonicsPlot shows what some of the preset waveforms would look like if they were approximated with
 * an infinite number of harmonics. This is supported for a subset of the Waveform enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class InfiniteHarmonicsPlot extends CanvasLinePlot {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Property.<Vector2[]>} dataSetProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSetProperty, visibleProperty, options ) {

    options = merge( {

      // CanvasLinePlot options
      lineWidth: 4,
      stroke: FMWColorProfile.infiniteHarmonicsStrokeProperty.value // CanvasLinePlot does not support Property.<Color>
    }, options );

    super( chartTransform, dataSetProperty.value, options );

    // @public (read-only) fires when the plot needs to be redrawn
    this.changedEmitter = new Emitter();

    // Keep synchronized with the data set. unlink is not needed.
    dataSetProperty.lazyLink( dataSet => {
      this.setDataSet( dataSet );
      this.changedEmitter.emit();
    } );

    // unlink is not needed.
    visibleProperty.link( visible => {
      this.visible = visible;
      this.changedEmitter.emit();
    } );

    // CanvasLinePlot does not support Property.<Color> for its stroke option.
    // So it's the client's responsibility to keep the plot in sync with the ColorProfile.
    // unlink is not needed.
    FMWColorProfile.infiniteHarmonicsStrokeProperty.lazyLink( color => {
      this.setStroke( color );
      this.changedEmitter.emit();
    } );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsPlot', InfiniteHarmonicsPlot );
export default InfiniteHarmonicsPlot;

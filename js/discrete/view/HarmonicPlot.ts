// Copyright 2020-2023, University of Colorado Boulder

/**
 * HarmonicPlot is a specialization of CanvasLinePlot that keeps the plot synchronized with a Harmonic.
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

export default class HarmonicPlot extends CanvasLinePlot {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic} harmonic
   * @param {ReadOnlyProperty.<Vector2[]>} dataSetProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonic, dataSetProperty, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && assert( harmonic instanceof Harmonic );
    assert && AssertUtils.assertAbstractPropertyOf( dataSetProperty, Array );

    options = merge( {}, options );

    assert && assert( !options.stroke, 'HarmonicPlot sets stroke' );
    options.stroke = harmonic.colorProperty.value; // CanvasLinePlot does not support Property.<Color>

    super( chartTransform, dataSetProperty.value, options );

    // @public (read-only)
    this.harmonic = harmonic;

    // @public (read-only) fires when the plot needs to be redrawn
    this.changedEmitter = new Emitter();

    // Keep synchronized with the data set.
    dataSetProperty.lazyLink( dataSet => {
      this.setDataSet( dataSet );
      this.changedEmitter.emit();
    } );

    // CanvasLinePlot does not support Property.<Color> for its stroke option.
    // So it's the client's responsibility to keep the plot in sync with the colorProfileProperty.
    harmonic.colorProperty.lazyLink( color => {
      this.setStroke( color );
      this.changedEmitter.emit();
    } );

    // Hide the plot when its amplitude is zero.
    harmonic.amplitudeProperty.link( amplitude => {
      this.visible = ( amplitude !== 0 );
      this.changedEmitter.emit();
    } );
  }
}

fourierMakingWaves.register( 'HarmonicPlot', HarmonicPlot );
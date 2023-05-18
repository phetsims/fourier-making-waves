// Copyright 2020-2023, University of Colorado Boulder

/**
 * HarmonicPlot is a specialization of CanvasLinePlot that keeps the plot synchronized with a Harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class HarmonicPlot extends CanvasLinePlot {

  public readonly harmonic: Harmonic; // the Harmonic associated with this plot
  public readonly changedEmitter: Emitter; // fires when the plot needs to be redrawn

  public constructor( chartTransform: ChartTransform, harmonic: Harmonic, dataSetProperty: TReadOnlyProperty<Vector2[]> ) {

    super( chartTransform, dataSetProperty.value, {

      // CanvasLinePlotOptions
      stroke: harmonic.colorProperty.value // CanvasLinePlot does not support Property<Color>
    } );

    this.harmonic = harmonic;
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
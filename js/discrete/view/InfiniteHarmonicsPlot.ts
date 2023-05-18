// Copyright 2021-2023, University of Colorado Boulder

/**
 * InfiniteHarmonicsPlot shows what some of the preset waveforms would look like if they were approximated with
 * an infinite number of harmonics. This is supported for a subset of the Waveform enumeration.  It is specific
 * to the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class InfiniteHarmonicsPlot extends CanvasLinePlot {

  public readonly changedEmitter: Emitter; // fires when the plot needs to be redrawn

  public constructor( chartTransform: ChartTransform,
                      dataSetProperty: TReadOnlyProperty<Vector2[]>,
                      visibleProperty: TReadOnlyProperty<boolean> ) {

    super( chartTransform, dataSetProperty.value, {

      // CanvasLinePlotOptions
      lineWidth: FMWConstants.SECONDARY_WAVEFORM_LINE_WIDTH
    } );

    this.changedEmitter = new Emitter();

    // Keep synchronized with the data set.
    dataSetProperty.lazyLink( dataSet => {
      this.setDataSet( dataSet );
      this.changedEmitter.emit();
    } );

    visibleProperty.link( visible => {
      this.visible = visible;
      this.changedEmitter.emit();
    } );

    // CanvasLinePlot does not support Property.<Color> for its stroke option.
    // So it's the client's responsibility to keep the plot in sync with the colorProfileProperty.
    FMWColors.secondaryWaveformStrokeProperty.link( color => {
      this.setStroke( color );
      this.changedEmitter.emit();
    } );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsPlot', InfiniteHarmonicsPlot );

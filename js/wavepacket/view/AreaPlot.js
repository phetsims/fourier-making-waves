// Copyright 2021, University of Colorado Boulder

/**
 * AreaPlot plots the area under the curve defined by its data set.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AreaPlot extends Path {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    super( null, options );

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeAreaPlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
    this.update();
  }

  /**
   * Recomputes the rendered shape.
   * @public
   */
  update() {
    const shape = new Shape();
    let moveToNextPoint = true;
    for ( let i = 0; i < this.dataSet.length; i++ ) {

      assert && assert( this.dataSet[ i ] === null || this.dataSet[ i ].isFinite(), 'data points must be finite Vector2 or null' );

      // Draw a line segment to the next non-null value. Null values result in a gap (via move) in the plot.
      if ( this.dataSet[ i ] ) {
        const viewPoint = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );
        if ( moveToNextPoint ) {
          shape.moveToPoint( viewPoint );
          moveToNextPoint = false;
        }
        else {
          shape.lineToPoint( viewPoint );
        }
      }
      else {
        moveToNextPoint = true;
      }
    }
    shape.close();
    this.shape = shape;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeLinePlot();
    super.dispose();
  }
}

fourierMakingWaves.register( 'AreaPlot', AreaPlot );
export default AreaPlot;
// Copyright 2021, University of Colorado Boulder

//TODO is this general enough to move to bamboo?
//TODO implement as a paintable for ChartCanvasNode?
/**
 * AreaPlot fills the area below a curve.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AreaPlot extends Path {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {

      // Path options
      fill: 'black'
    }, options );

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
    this.disposeLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
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
   * @override
   */
  update() {
    assert && assert( _.every( this.dataSet, point => point !== null ), 'all points in data set must be non-null' );
    assert && assert( _.every( this.dataSet, point => point.isFinite() ), 'all points in data set must be finite' );
    assert && assert( _.every( this.dataSet, point => point.y >= 0 ), 'all y values must be >= 0' );

    const shape = new Shape();
    const numberOfPoints = this.dataSet.length;
    if ( numberOfPoints > 0 ) {
      assert && assert( numberOfPoints > 1, 'at least 2 points are required to have an area under a curve' );

      const firstModelPoint = this.dataSet[ 0 ];
      const lastModelPoint = this.dataSet[ numberOfPoints - 1 ];
      let startIndex = 0;
      let viewPoint;

      // Start at y=0
      if ( firstModelPoint.y === 0 ) {
        viewPoint = this.chartTransform.modelToViewPosition( firstModelPoint );
        shape.moveToPoint( viewPoint );
        startIndex++;
      }
      else {
        viewPoint = this.chartTransform.modelToViewPosition( new Vector2( firstModelPoint.x, 0 ) );
        shape.moveToPoint( viewPoint );
      }

      // Line segments to each point in the data set
      for ( let i = startIndex; i < numberOfPoints; i++ ) {
        viewPoint = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );
        shape.lineToPoint( viewPoint );
      }

      // End at y=0
      if ( lastModelPoint.y !== 0 ) {
        viewPoint = this.chartTransform.modelToViewPosition( new Vector2( lastModelPoint.x, 0 ) );
        shape.lineToPoint( viewPoint );
      }

      // Close the Shape, so the Path can be filled.
      shape.close();
    }
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
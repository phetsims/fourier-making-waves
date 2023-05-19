// Copyright 2021-2023, University of Colorado Boulder

/**
 * GaussianAreaPlot fills the area below a Gaussian curve. The client is responsible for providing a data set that
 * describes a Gaussian curve, with points ordered by increasing x value. This plot converts that data set to a
 * fillable Shape by (1) ensuring that the first and last points in the Shape have y=0, and (2) calling close on
 * the Shape.
 *
 * NOTE: Despite the general-sounding name, this implementation has only been tested for Fourier: Making Waves.
 * Moving it to bamboo for general use will require further design and generalization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class GaussianAreaPlot extends Path {

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

    // @private {ChartTransform}
    this.chartTransform = chartTransform;

    // @public {Vector2[]} if you change this directly, you are responsible for calling update
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
   * Sets the dataSet and redraws the plot.
   * If the dataSet is mutated directly, it is the client's responsibility to call update.
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
    this.update();
  }

  /**
   * Recomputes the rendered Shape.
   * @public
   */
  update() {
    assert && assert( _.every( this.dataSet, ( point, index, dataSet ) =>
    ( point !== null ) // null values (gaps) are not supported
    && ( point.isFinite() ) // all points must be finite
    && ( index === 0 || dataSet[ index - 1 ].x < point.x ) // x values are unique and in ascending order
    && ( point.y >= 0 ) // all y values must be >= 0
    ) );

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

fourierMakingWaves.register( 'GaussianAreaPlot', GaussianAreaPlot );
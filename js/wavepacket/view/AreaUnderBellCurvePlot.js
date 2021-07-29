// Copyright 2021, University of Colorado Boulder

/**
 * AreaUnderBellCurvePlot plots a bell curve, and fills the area below the curve.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LinePlot from '../../../../bamboo/js/LinePlot.js';
import merge from '../../../../phet-core/js/merge.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AreaUnderBellCurvePlot extends LinePlot {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {
      stroke: null,
      fill: 'black'
    }, options );

    super( chartTransform, dataSet, options );
  }

  /**
   * Recomputes the rendered shape.
   * @public
   * @override
   */
  update() {
    super.update();
    if ( this.dataSet.length > 1 ) {
      this.shape.close();
    }
  }
}

fourierMakingWaves.register( 'AreaUnderBellCurvePlot', AreaUnderBellCurvePlot );
export default AreaUnderBellCurvePlot;
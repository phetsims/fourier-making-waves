// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicPlot is a specialization of CanvasLinePlot that adds:
 * - a reference to the associated harmonic
 * - visibility of the plot
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class HarmonicPlot extends CanvasLinePlot {

  /**
   * @param {Harmonic} harmonic
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( harmonic, chartTransform, dataSet, options ) {

    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && AssertUtils.assertArray( dataSet );

    super( chartTransform, dataSet, options );

    // @public (read-only)
    this.harmonic = harmonic;
  }
}

fourierMakingWaves.register( 'HarmonicPlot', HarmonicPlot );
export default HarmonicPlot;
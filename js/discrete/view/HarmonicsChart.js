// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsChart is the 'Harmonics' chart in the 'Discrete' screen. It renders a plot for each of the harmonics in
 * the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class HarmonicsChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Object} [options]
   */
  constructor( fourierSeries, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    //TODO
    const backgroundNode = new Rectangle( 0, 0, 718, 150, {
      fill: 'white',
      stroke: 'black'
    } );

    assert && assert( !options.children, 'HarmonicsChart sets children' );
    options.children = [ backgroundNode ];

    super( options );
  }

  /**
   * Steps the chart.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

fourierMakingWaves.register( 'HarmonicsChart', HarmonicsChart );
export default HarmonicsChart;
// Copyright 2021, University of Colorado Boulder

/**
 * ComponentsChartNode is the 'Components' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ComponentsChartNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // ChartTransform options
      transformOptions: {
        modelXRange: new Range( 0, 1 ),
        modelYRange: new Range( 0, 1 ),
        viewWidth: 100,
        viewHeight: 100
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // the transform from model to view coordinates
    const chartTransform = new ChartTransform( options.transformOptions );

    const chartRectangle = new ChartRectangle( chartTransform, {
      stroke: FMWColorProfile.chartGridLinesStrokeProperty,
      fill: 'white',
      tandem: options.tandem.createTandem( 'chartRectangle' )
    } );

    assert && assert( !options.children );
    options.children = [ chartRectangle ];

    super( options );

    // @public for layout
    this.chartRectangle = chartRectangle;
  }
}

fourierMakingWaves.register( 'ComponentsChartNode', ComponentsChartNode );
export default ComponentsChartNode;
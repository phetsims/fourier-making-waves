// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousSumChartNode is the 'Sum' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import EnvelopeCheckbox from './EnvelopeCheckbox.js';

//TODO placeholder
class ContinuousSumChartNode extends Node {

  /**
   * @param {Property.<boolean>} envelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( envelopeVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( envelopeVisibleProperty, 'boolean' );

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

    const envelopeCheckbox = new EnvelopeCheckbox( envelopeVisibleProperty, {
      right: chartRectangle.right - 5,
      top: chartRectangle.bottom + 5,
      tandem: options.tandem.createTandem( 'envelopeCheckbox' )
    } );

    assert && assert( !options.children );
    options.children = [ chartRectangle, envelopeCheckbox ];

    super( options );
  }
}

fourierMakingWaves.register( 'ContinuousSumChartNode', ContinuousSumChartNode );
export default ContinuousSumChartNode;
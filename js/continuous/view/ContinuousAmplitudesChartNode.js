// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousAmplitudesChartNode is the 'Amplitudes' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';

//TODO placeholder
class ContinuousAmplitudesChartNode extends Node {

  /**
   * @param {Property.<boolean>} continuousWaveformVisibleProperty
   * @param {Object} [options]
   */
  constructor( continuousWaveformVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( continuousWaveformVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    //TODO placeholder
    const rectangle = new Rectangle( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, {
      stroke: 'black',
      fill: 'white'
    } );

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox( continuousWaveformVisibleProperty, {
      right: rectangle.right - 5,
      top: rectangle.bottom + 5,
      tandem: options.tandem.createTandem( 'continuousWaveformCheckbox' )
    } );

    assert && assert( !options.children );
    options.children = [ rectangle, continuousWaveformCheckbox ];

    super( options );
  }
}

fourierMakingWaves.register( 'ContinuousAmplitudesChartNode', ContinuousAmplitudesChartNode );
export default ContinuousAmplitudesChartNode;
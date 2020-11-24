// Copyright 2020, University of Colorado Boulder

/**
 * SumChart is the 'Sum' chart in the 'Discrete' screen. It renders 1 plot showing the sum of the harmonics in
 * the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';

class SumChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<boolean>} autoScaleProperty
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, autoScaleProperty, infiniteHarmonicsVisibleProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertPropertyOf( autoScaleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( infiniteHarmonicsVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    //TODO
    const backgroundNode = new Rectangle( 0, 0, 718, 150, {
      fill: 'white',
      stroke: 'black'
    } );

    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty );

    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty );

    assert && assert( !options.children, 'SumChart sets children' );
    options.children = [
      new VBox( {
        spacing: 5,
        children: [
          backgroundNode,
          new HBox( {
            spacing: 25,
            children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ]
          } )
        ]
      } )
    ];

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

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;
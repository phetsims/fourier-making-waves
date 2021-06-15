// Copyright 2021, University of Colorado Boulder

/**
 * ComponentsChart is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import XAxisDescription from '../../common/model/XAxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

class ComponentsChart {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {WavePacket} wavePacket
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, wavePacket, xAxisDescriptionProperty, options ) {

    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, XAxisDescription );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.domainProperty = domainProperty;
    this.wavePacket = wavePacket;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'ComponentsChart', ComponentsChart );
export default ComponentsChart;
// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChart is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
//TODO flesh out Y_AXIS_DESCRIPTIONS
const Y_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    max: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } )
];

class WavePacketComponentsChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, xAxisDescriptionProperty, options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.wavePacket = wavePacket;
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.yAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 0 ], {
      validValues: Y_AXIS_DESCRIPTIONS
    } );

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );

    //TODO adjust yAxisDescriptionProperty based on the maxY of the component data sets
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChart', WavePacketComponentsChart );
export default WavePacketComponentsChart;
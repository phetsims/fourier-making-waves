// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketModel is the top-level model for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import DiscreteXAxisDescriptions from '../../discrete/model/DiscreteXAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ComponentsChart from './ComponentsChart.js';
import WavePacket from './WavePacket.js';
import WavePacketAmplitudesChart from './WavePacketAmplitudesChart.js';
import WavePacketSumChart from './WavePacketSumChart.js';

class WavePacketModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.maxAmplitude = 0.21; //TODO ??
    this.significantWidth = 24 * Math.PI; //TODO rename

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      validValues: [ Domain.SPACE, Domain.TIME ],
      tandem: options.tandem.createTandem( 'domainProperty' )
    } );

    // @public
    this.seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE, {
      tandem: options.tandem.createTandem( 'seriesTypeProperty' )
    } );

    // @public
    this.widthIndicatorsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'widthIndicatorsVisibleProperty' )
    } );

    // @public
    this.wavePacket = new WavePacket( {
      tandem: options.tandem.createTandem( 'wavePacket' )
    } );

    //TODO initial value and valid values are not correct
    // {Property.<XAxisDescription>} the x-axis description is shared by the Components and Sum charts.
    // dispose is not needed.
    const xAxisDescriptionProperty = new Property( DiscreteXAxisDescriptions[ DiscreteXAxisDescriptions.length - 2 ], {
      validValues: DiscreteXAxisDescriptions
    } );

    // @public
    this.amplitudesChart = new WavePacketAmplitudesChart( this.domainProperty, {
      tandem: options.tandem.createTandem( 'amplitudesChart' )
    } );

    // @public
    this.componentsChart = new ComponentsChart( this.domainProperty, this.wavePacket, xAxisDescriptionProperty, {
      tandem: options.tandem.createTandem( 'componentsChart' )
    } );

    // @public
    this.sumChart = new WavePacketSumChart( this.domainProperty, xAxisDescriptionProperty, {
      tandem: options.tandem.createTandem( 'sumChart' )
    } );
  }

  /**
   * @public
   */
  reset() {

    // Properties
    this.domainProperty.reset();
    this.seriesTypeProperty.reset();
    this.widthIndicatorsVisibleProperty.reset();

    // sub-models
    this.wavePacket.reset();
    this.amplitudesChart.reset();
    this.componentsChart.reset();
    this.sumChart.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'WavePacketModel', WavePacketModel );
export default WavePacketModel;
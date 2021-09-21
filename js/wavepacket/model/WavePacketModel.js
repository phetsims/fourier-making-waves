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
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketAmplitudesChart from './WavePacketAmplitudesChart.js';
import WavePacketAxisDescriptions from './WavePacketAxisDescriptions.js';
import WavePacketComponentsChart from './WavePacketComponentsChart.js';
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

    const domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      validValues: [ Domain.SPACE, Domain.TIME ], // Domain SPACE_AND_TIME is not supported in this screen
      tandem: options.tandem.createTandem( 'domainProperty' )
    } );

    const seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE, {
      tandem: options.tandem.createTandem( 'seriesTypeProperty' )
    } );

    const widthIndicatorsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'widthIndicatorsVisibleProperty' )
    } );

    const wavePacket = new WavePacket( {
      tandem: options.tandem.createTandem( 'wavePacket' )
    } );

    // {Property.<AxisDescription>} the x-axis description shared by the Components and Sum charts
    const xAxisDescriptionProperty = new Property( WavePacketAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION, {
      validValues: WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS
    } );

    // Parent tandem for all charts
    const chartsTandem = options.tandem.createTandem( 'charts' );

    const amplitudesChart = new WavePacketAmplitudesChart( wavePacket, domainProperty,
      widthIndicatorsVisibleProperty, {
        tandem: chartsTandem.createTandem( 'amplitudesChart' )
      } );

    const componentsChart = new WavePacketComponentsChart( wavePacket, domainProperty, seriesTypeProperty,
      xAxisDescriptionProperty, {
        tandem: chartsTandem.createTandem( 'componentsChart' )
      } );

    const sumChart = new WavePacketSumChart( componentsChart.componentDataSetsProperty,
      wavePacket, domainProperty, seriesTypeProperty, xAxisDescriptionProperty, widthIndicatorsVisibleProperty, {
        tandem: chartsTandem.createTandem( 'sumChart' )
      } );

    // @private
    this.resetWavePacketModel = () => {

      // Properties
      domainProperty.reset();
      seriesTypeProperty.reset();
      widthIndicatorsVisibleProperty.reset();
      xAxisDescriptionProperty.reset();

      // sub-models
      wavePacket.reset();
      amplitudesChart.reset();
      componentsChart.reset();
      sumChart.reset();
    };

    // @public
    this.domainProperty = domainProperty; // {EnumerationProperty.<Domain>}
    this.seriesTypeProperty = seriesTypeProperty; // {EnumerationProperty.<SeriesType>}
    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty; // {Property.<boolean>}
    this.wavePacket = wavePacket; // {WavePacket}
    this.amplitudesChart = amplitudesChart; // {WavePacketAmplitudesChart}
    this.componentsChart = componentsChart; // {WavePacketComponentsChart}
    this.sumChart = sumChart; // {WavePacketSumChart}
  }

  /**
   * @public
   */
  reset() {
    this.resetWavePacketModel();
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
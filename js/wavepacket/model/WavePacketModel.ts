// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavePacketModel is the top-level model for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketAmplitudesChart from './WavePacketAmplitudesChart.js';
import WavePacketAxisDescriptions from './WavePacketAxisDescriptions.js';
import WavePacketComponentsChart from './WavePacketComponentsChart.js';
import WavePacketSumChart from './WavePacketSumChart.js';

export default class WavePacketModel implements TModel {

  public readonly domainProperty: EnumerationProperty<Domain>;
  public readonly seriesTypeProperty: EnumerationProperty<SeriesType>;
  public readonly widthIndicatorsVisibleProperty: Property<boolean>;
  public readonly wavePacket: WavePacket;
  public readonly amplitudesChart: WavePacketAmplitudesChart;
  public readonly componentsChart: WavePacketComponentsChart;
  public readonly sumChart: WavePacketSumChart;

  private readonly resetWavePacketModel: () => void;

  public constructor( tandem: Tandem ) {

    this.domainProperty = new EnumerationProperty( Domain.SPACE, {
      validValues: [ Domain.SPACE, Domain.TIME ], // Domain SPACE_AND_TIME is not supported in this screen
      tandem: tandem.createTandem( 'domainProperty' )
    } );

    this.seriesTypeProperty = new EnumerationProperty( SeriesType.SIN, {
      tandem: tandem.createTandem( 'seriesTypeProperty' )
    } );

    this.widthIndicatorsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'widthIndicatorsVisibleProperty' )
    } );

    this.wavePacket = new WavePacket( tandem.createTandem( 'wavePacket' ) );

    // {Property.<AxisDescription>} the x-axis description shared by the Components and Sum charts
    const xAxisDescriptionProperty = new Property( WavePacketAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION, {
      validValues: WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS
    } );

    // Parent tandem for all charts
    const chartsTandem = tandem.createTandem( 'charts' );

    this.amplitudesChart = new WavePacketAmplitudesChart( this.wavePacket, this.domainProperty,
      this.widthIndicatorsVisibleProperty, chartsTandem.createTandem( 'amplitudesChart' ) );

    this.componentsChart = new WavePacketComponentsChart( this.wavePacket, this.domainProperty, this.seriesTypeProperty,
      xAxisDescriptionProperty, chartsTandem.createTandem( 'componentsChart' ) );

    this.sumChart = new WavePacketSumChart( this.componentsChart.componentDataSetsProperty,
      this.wavePacket, this.domainProperty, this.seriesTypeProperty, xAxisDescriptionProperty,
      this.widthIndicatorsVisibleProperty, chartsTandem.createTandem( 'sumChart' ) );

    this.resetWavePacketModel = () => {

      // Properties
      this.domainProperty.reset();
      this.seriesTypeProperty.reset();
      this.widthIndicatorsVisibleProperty.reset();
      xAxisDescriptionProperty.reset();

      // sub-models
      this.wavePacket.reset();
      this.amplitudesChart.reset();
      this.componentsChart.reset();
      this.sumChart.reset();
    };
  }

  public reset(): void {
    this.resetWavePacketModel();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'WavePacketModel', WavePacketModel );
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
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketAmplitudesChart from './WavePacketAmplitudesChart.js';
import WavePacketAxisDescriptions from './WavePacketAxisDescriptions.js';
import WavePacketComponentsChart from './WavePacketComponentsChart.js';
import WavePacketSumChart from './WavePacketSumChart.js';

// constants
const X_AXIS_DESCRIPTIONS = WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS;
const Y_AXIS_DESCRIPTIONS = WavePacketAxisDescriptions.Y_AXIS_DESCRIPTIONS;

// {AxisDescription} default description for the x axis
const DEFAULT_X_AXIS_DESCRIPTION = X_AXIS_DESCRIPTIONS[ 2 ];
assert && assert( DEFAULT_X_AXIS_DESCRIPTION.range.getLength() === 4,
  'Expected DEFAULT_X_AXIS_DESCRIPTION range to be 4 wavelengths. Did you modify X_AXIS_DESCRIPTIONS?' );

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

    // The format of x-axis labels for the Components and Sum charts. The view in this screen supports only numeric.
    // We use validValues to limit this Property to its single supported value.
    // A Property is required by some reusable components.
    const xAxisTickLabelFormatProperty = new EnumerationProperty( TickLabelFormat, TickLabelFormat.NUMERIC, {
      validValues: [ TickLabelFormat.NUMERIC ]
    } );

    // {Property.<AxisDescription>} the x-axis description shared by the Components and Sum charts
    const xAxisDescriptionProperty = new Property( DEFAULT_X_AXIS_DESCRIPTION, {
      validValues: X_AXIS_DESCRIPTIONS
    } );

    //TODO componentsYAxisDescriptionProperty is not used!
    // {Property.<AxisDescription>} the y-axis description for the Components chart
    const componentsYAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 0 ], {
      validValues: Y_AXIS_DESCRIPTIONS
    } );

    //TODO sumYAxisDescriptionProperty is not used!
    // {Property.<AxisDescription>} the y-axis description for the Sum chart
    const sumYAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 0 ], {
      validValues: Y_AXIS_DESCRIPTIONS
    } );

    // Parent tandem for all charts
    const chartsTandem = options.tandem.createTandem( 'charts' );

    const amplitudesChart = new WavePacketAmplitudesChart( wavePacket, domainProperty, widthIndicatorsVisibleProperty, {
      tandem: chartsTandem.createTandem( 'amplitudesChart' )
    } );

    const componentsChart = new WavePacketComponentsChart( wavePacket, domainProperty, seriesTypeProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, componentsYAxisDescriptionProperty, {
        tandem: chartsTandem.createTandem( 'componentsChart' )
      } );

    const sumChart = new WavePacketSumChart( componentsChart.componentDataSetsProperty,
      wavePacket, domainProperty, seriesTypeProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty,
      sumYAxisDescriptionProperty, widthIndicatorsVisibleProperty, {
        tandem: chartsTandem.createTandem( 'sumChart' )
      } );

    // @public (read-only)
    this.maxAmplitude = 0.21; //TODO ??

    // @private
    this.resetWavePacketModel = () => {

      // Properties
      domainProperty.reset();
      seriesTypeProperty.reset();
      widthIndicatorsVisibleProperty.reset();
      xAxisDescriptionProperty.reset();
      componentsYAxisDescriptionProperty.reset();
      sumYAxisDescriptionProperty.reset();

      // sub-models
      wavePacket.reset();
      amplitudesChart.reset();
      componentsChart.reset();
      sumChart.reset();
    };

    // @public
    this.domainProperty = domainProperty;
    this.seriesTypeProperty = seriesTypeProperty;
    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty;
    this.wavePacket = wavePacket;
    this.amplitudesChart = amplitudesChart;
    this.componentsChart = componentsChart;
    this.sumChart = sumChart;
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
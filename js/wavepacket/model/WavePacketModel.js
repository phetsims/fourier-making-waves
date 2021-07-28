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

    // @public (read-only)
    this.maxAmplitude = 0.21; //TODO ??

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

    // The format of x-axis labels for the Components and Sum charts, supports only numeric.
    // A Property is required by some reusable components.
    const xAxisTickLabelFormatProperty = new EnumerationProperty( TickLabelFormat, TickLabelFormat.NUMERIC, {
      validValues: [ TickLabelFormat.NUMERIC ]
    } );

    // {Property.<AxisDescription>} the x-axis description shared by the Components and Sum charts
    const xAxisDescriptionProperty = new Property( DEFAULT_X_AXIS_DESCRIPTION, {
      validValues: X_AXIS_DESCRIPTIONS
    } );

    // {Property.<AxisDescription>} the y-axis description for the Components chart
    const componentsYAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 0 ], {
      validValues: Y_AXIS_DESCRIPTIONS
    } );

    // {Property.<AxisDescription>} the y-axis description for the Sum chart
    const sumYAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 0 ], {
      validValues: Y_AXIS_DESCRIPTIONS
    } );

    // Parent tandem for all charts
    const chartsTandem = options.tandem.createTandem( 'charts' );

    // @public
    this.amplitudesChart = new WavePacketAmplitudesChart( this.wavePacket, this.domainProperty, {
      tandem: chartsTandem.createTandem( 'amplitudesChart' )
    } );

    // @public
    this.componentsChart = new WavePacketComponentsChart( this.wavePacket, this.domainProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, componentsYAxisDescriptionProperty, {
        tandem: chartsTandem.createTandem( 'componentsChart' )
      } );

    // @public
    this.sumChart = new WavePacketSumChart( this.wavePacket, this.domainProperty, xAxisTickLabelFormatProperty,
      xAxisDescriptionProperty, sumYAxisDescriptionProperty, {
        tandem: chartsTandem.createTandem( 'sumChart' )
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
// Copyright 2021-2022, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the model for the 'Amplitudes of Fourier Components' chart in
 * the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import Domain from '../../common/model/Domain.js';
import DomainChart from '../../common/model/DomainChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketAxisDescriptions from './WavePacketAxisDescriptions.js';

// constants
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

// AxisDescription for the x-axis contains coefficients of PI, and it's the same for space and time Domains.
const X_AXIS_MULTIPLIER = Math.PI;

class WavePacketAmplitudesChart extends DomainChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, widthIndicatorsVisibleProperty, options ) {

    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // {Property.<AxisDescription>}
    // The x axis has a fixed scale. Use validValues to make this Property essentially a constant.
    const xAxisDescriptionProperty = new Property( WavePacketAxisDescriptions.AMPLITUDES_X_AXIS_DESCRIPTION, {
      validValues: [ WavePacketAxisDescriptions.AMPLITUDES_X_AXIS_DESCRIPTION ]
    } );

    super( domainProperty, xAxisDescriptionProperty, X_AXIS_MULTIPLIER, X_AXIS_MULTIPLIER, options );

    // @public (read-only)
    this.waveNumberRange = wavePacket.waveNumberRange;
    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty;

    // @public
    this.continuousWaveformVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'continuousWaveformVisibleProperty' )
    } );

    // @public {DerivedProperty.<Vector2[]>} data set for a finite number of Fourier components, EMPTY_DATA_SET if the
    // number of components is infinite. x = wave number, y = amplitude. Points are ordered by increasing x value.
    this.finiteComponentsDataSetProperty = new DerivedProperty(
      [ wavePacket.componentsProperty ],
      components => {
        let dataSet = EMPTY_DATA_SET;
        if ( components.length > 0 ) {
          dataSet = components.map( component => new Vector2( component.waveNumber, component.amplitude ) );
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<Vector2[]>} Data set for a continuous waveform. This must always be created,
    // because it determines the peak amplitude of the chart, and thus its y-axis scale.
    this.continuousWaveformDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      ( componentSpacing, center, standardDeviation ) => createContinuousWaveformDataSet( wavePacket )
    );

    // @public {DerivedProperty.<Vector2[]>} Data set for a continuous waveform, displayed when the number of
    // components is infinite, otherwise [].  When components are infinite, this is the same data set as that's
    // used for Continuous Waveform, but will be plotted differently.
    this.infiniteComponentsDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, this.continuousWaveformDataSetProperty ],
      ( componentSpacing, continuousWaveformDataSet ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( componentSpacing === 0 ) {
          dataSet = continuousWaveformDataSet;
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<number>} the peak amplitude, used to scale the chart's y axis.
    this.peakAmplitudeProperty = new DerivedProperty(
      [ this.continuousWaveformDataSetProperty ],
      continuousWaveformDataSet => _.maxBy( continuousWaveformDataSet, point => point.y ).y
    );

    // @public {DerivedProperty.<AxisDescription>} y-axis description that is the best-fit for peakAmplitudeProperty
    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.peakAmplitudeProperty ],
      peakAmplitude =>
        AxisDescription.getBestFit( new Range( 0, peakAmplitude ), WavePacketAxisDescriptions.AMPLITUDES_Y_AXIS_DESCRIPTIONS ), {
        validValues: WavePacketAxisDescriptions.AMPLITUDES_Y_AXIS_DESCRIPTIONS
      } );

    // @public {DerivedProperty.<Vector2>} width that is displayed by the width indicator
    // This is identical to the wave packet's width, but we are deriving a Property named widthIndicatorWidthProperty
    // so that all charts have a similar API for width indicators.
    this.widthIndicatorWidthProperty = new DerivedProperty( [ wavePacket.widthProperty ], width => width );

    // @public {DerivedProperty.<Vector2>} position of the width indicator
    // This is loosely based on the getModelLocation method in WavePacketKWidthPlot.java.
    this.widthIndicatorPositionProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      ( componentSpacing, center, standardDeviation ) => {
        const x = center;
        let y = wavePacket.getComponentAmplitude( center + standardDeviation );
        if ( componentSpacing !== 0 ) {
          y = componentSpacing * y;
        }
        return new Vector2( x, y );
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
   * @override
   */
  reset() {
    super.reset();
    this.continuousWaveformVisibleProperty.reset();
  }
}

/**
 * Creates the data set that approximates a continuous waveform. Ordered by increasing wave number.
 * This is loosely based on the updateEnvelope method in D2CAmplitudesView.java.
 * @param {WavePacket} wavePacket
 * @returns {Vector2[]} - x is wave number, y is amplitude
 * @private
 */
function createContinuousWaveformDataSet( wavePacket ) {
  assert && assert( wavePacket instanceof WavePacket );

  const componentSpacing = wavePacket.componentSpacingProperty.value;
  const step = Math.PI / 10; // chosen empirically, so that the plot looks smooth
  const maxWaveNumber = wavePacket.waveNumberRange.max + step; // one more point than we need

  const dataSet = []; // {Vector2[]}
  let waveNumber = wavePacket.waveNumberRange.min;
  while ( waveNumber <= maxWaveNumber ) {
    let amplitude = wavePacket.getComponentAmplitude( waveNumber );
    if ( componentSpacing !== 0 ) {
      amplitude *= componentSpacing;
    }
    dataSet.push( new Vector2( waveNumber, amplitude ) );
    waveNumber += step;
  }
  return dataSet;
}

fourierMakingWaves.register( 'WavePacketAmplitudesChart', WavePacketAmplitudesChart );
export default WavePacketAmplitudesChart;
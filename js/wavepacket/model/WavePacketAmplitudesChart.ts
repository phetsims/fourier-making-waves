// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the model for the 'Amplitudes of Fourier Components' chart in
 * the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import DomainChart from '../../common/model/DomainChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketAxisDescriptions from './WavePacketAxisDescriptions.js';
import Domain from '../../common/model/Domain.js';

// constants
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

// AxisDescription for the x-axis contains coefficients of PI, and it's the same for space and time Domains.
const X_AXIS_MULTIPLIER = Math.PI;

export default class WavePacketAmplitudesChart extends DomainChart {

  public readonly waveNumberRange: Range;
  public readonly widthIndicatorsVisibleProperty: Property<boolean>;
  public readonly continuousWaveformVisibleProperty: Property<boolean>;

  // Data set for a finite number of Fourier components, EMPTY_DATA_SET if the number of components is infinite.
  // x = wave number, y = amplitude. Points are ordered by increasing x value.
  public readonly finiteComponentsDataSetProperty: TReadOnlyProperty<Vector2[]>;

  // Data set for a continuous waveform. This must always be created, because it determines the peak amplitude of
  // the chart, and thus its y-axis scale.
  public readonly continuousWaveformDataSetProperty: TReadOnlyProperty<Vector2[]>;

  // Data set for a continuous waveform, displayed when the number of components is infinite, otherwise [].
  // When components are infinite, this is the same data set as that's used for Continuous Waveform, but will be
  // plotted differently.
  public readonly infiniteComponentsDataSetProperty: TReadOnlyProperty<Vector2[]>;

  // the peak amplitude, used to scale the chart's y-axis.
  public readonly peakAmplitudeProperty: TReadOnlyProperty<number>;

  // y-axis description that is the best-fit for peakAmplitudeProperty
  public readonly yAxisDescriptionProperty: TReadOnlyProperty<AxisDescription>;

  // Width that is displayed by the width indicator.  This is identical to the wave packet's width, but we are
  // deriving a Property named widthIndicatorWidthProperty so that all charts have a similar API for width indicators.
  public readonly widthIndicatorWidthProperty: TReadOnlyProperty<number>;

  // Position of the width indicator. This is loosely based on the getModelLocation method in WavePacketKWidthPlot.java.
  public readonly widthIndicatorPositionProperty: TReadOnlyProperty<Vector2>;

  public constructor( wavePacket: WavePacket, domainProperty: EnumerationProperty<Domain>,
                      widthIndicatorsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    // {Property.<AxisDescription>}
    // The x-axis has a fixed scale. Use validValues to make this Property essentially a constant.
    const xAxisDescriptionProperty = new Property( WavePacketAxisDescriptions.AMPLITUDES_X_AXIS_DESCRIPTION, {
      validValues: [ WavePacketAxisDescriptions.AMPLITUDES_X_AXIS_DESCRIPTION ]
    } );

    super( domainProperty, xAxisDescriptionProperty, X_AXIS_MULTIPLIER, X_AXIS_MULTIPLIER, tandem );

    this.waveNumberRange = wavePacket.waveNumberRange;
    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty;

    this.continuousWaveformVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'continuousWaveformVisibleProperty' )
    } );

    this.finiteComponentsDataSetProperty = new DerivedProperty(
      [ wavePacket.componentsProperty ],
      components => {
        let dataSet: Vector2[] = EMPTY_DATA_SET;
        if ( components.length > 0 ) {
          dataSet = components.map( component => new Vector2( component.waveNumber, component.amplitude ) );
        }
        return dataSet;
      } );

    this.continuousWaveformDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      ( componentSpacing, center, standardDeviation ) => createContinuousWaveformDataSet( wavePacket )
    );

    this.infiniteComponentsDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, this.continuousWaveformDataSetProperty ],
      ( componentSpacing, continuousWaveformDataSet ) => {
        let dataSet: Vector2[] = EMPTY_DATA_SET;
        if ( componentSpacing === 0 ) {
          dataSet = continuousWaveformDataSet;
        }
        return dataSet;
      } );

    this.peakAmplitudeProperty = new DerivedProperty(
      [ this.continuousWaveformDataSetProperty ],
      continuousWaveformDataSet => _.maxBy( continuousWaveformDataSet, point => point.y )!.y
    );

    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.peakAmplitudeProperty ],
      peakAmplitude =>
        AxisDescription.getBestFit( new Range( 0, peakAmplitude ), WavePacketAxisDescriptions.AMPLITUDES_Y_AXIS_DESCRIPTIONS ), {
        validValues: WavePacketAxisDescriptions.AMPLITUDES_Y_AXIS_DESCRIPTIONS
      } );

    this.widthIndicatorWidthProperty = new DerivedProperty( [ wavePacket.widthProperty ], width => width );

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

  public override reset(): void {
    super.reset();
    this.continuousWaveformVisibleProperty.reset();
  }
}

/**
 * Creates the data set that approximates a continuous waveform. Ordered by increasing wave number.
 * This is loosely based on the updateEnvelope method in D2CAmplitudesView.java.
 * @param wavePacket
 * @returns a Vector2, where x is wave number, y is amplitude
 */
function createContinuousWaveformDataSet( wavePacket: WavePacket ): Vector2[] {

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
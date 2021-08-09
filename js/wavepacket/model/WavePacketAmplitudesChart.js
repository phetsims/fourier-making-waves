// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

class WavePacketAmplitudesChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
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

    // @public
    this.wavePacket = wavePacket;
    this.domainProperty = domainProperty;
    this.widthIndicatorsVisibleProperty = widthIndicatorsVisibleProperty;

    // @public whether this chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );

    // @public
    this.continuousWaveformVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'continuousWaveformVisibleProperty' )
    } );

    // @public {DerivedProperty.<Vector2[]>} data set for a finite number of Fourier components, [] if the number 
    // of components is infinite. x = wave number, y = amplitude. Points are ordered by increasing wave number.
    this.amplitudesDataSetProperty = new DerivedProperty(
      [ wavePacket.componentsProperty ],
      components => {
        return _.map( components, component => new Vector2( component.waveNumber, component.amplitude ) );
      } );

    // @public {DerivedProperty.<Vector2[]>} data set displayed when the 'Continuous Wave' checkbox is checked.
    // Points are ordered by increasing x value.
    this.continuousWaveformDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      () => createContinuousWaveformDataSet( wavePacket )
    );

    // @public {DerivedProperty.<number>} the maximum y value, used to scale the chart's y axis.
    this.maxYProperty = new DerivedProperty(
      [ this.continuousWaveformVisibleProperty, this.amplitudesDataSetProperty, this.continuousWaveformDataSetProperty ],
      ( continuousWaveformVisible, amplitudesDataSet, continuousWaveformDataSet ) => {

        // Choose the data set that determines the maxY.
        const dataSet = ( continuousWaveformVisible || amplitudesDataSet.length === 0 ) ?
                        continuousWaveformDataSet : amplitudesDataSet;

        // Find maxY in that data set. Use a small value to ensure that it's non-zero.
        return Math.max( 1e-6, _.maxBy( dataSet, point => point.y ).y );
      } );

    // @public {DerivedProperty.<Vector2>} width that is displayed by the width indicator
    // This is identical to the wave packet's width, but we are deriving a Property name widthIndicatorWidthProperty
    // so that all charts have a similar API for width indicators.
    this.widthIndicatorWidthProperty = new DerivedProperty( [ wavePacket.widthProperty ], width => width );

    // @public {DerivedProperty.<Vector2>} position of the width indicator
    // This is loosely based on the getModelLocation method in WavePacketKWidthPlot.java.
    this.widthIndicatorPositionProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      ( componentSpacing, center, standardDeviation ) => {
        const x = center;
        const waveNumber = center + standardDeviation;
        let y = wavePacket.getComponentAmplitude( waveNumber );
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
   */
  reset() {
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
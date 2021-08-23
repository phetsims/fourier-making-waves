// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the 'Amplitudes' chart on the 'Wave Packet' screen.
 * Optimized to update only the data sets that will actually be visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

// constants
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

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

    // @public whether this chart is expanded
    this.chartExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartExpandedProperty' )
    } );

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
          dataSet = _.map( components, component => new Vector2( component.waveNumber, component.amplitude ) );
        }
        return dataSet;
      } );

    // Data set for a continuous waveform, potentially shared in 2 situations:
    // (1) when the number of components is infinite, and
    // (2) the 'Continuous Wave' checkbox is checked.
    // Those 2 situations are supported in the public API by this.infiniteComponentsDataSetProperty and
    // this.continuousWaveformDataSetProperty respectively.
    const continuousWaveformDataSetProperty = new DerivedProperty(
      [ this.continuousWaveformVisibleProperty, wavePacket.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      ( continuousWaveformVisible, componentSpacing, center, standardDeviation ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( continuousWaveformVisible || componentSpacing === 0 ) {
          dataSet = createContinuousWaveformDataSet( wavePacket );
        }
        return dataSet;
      }
    );

    // @public {DerivedProperty.<Vector2[]>} Data set for a continuous waveform, displayed when the number of
    // components is infinite, otherwise [].  Points are ordered by increasing x value.
    this.infiniteComponentsDataSetProperty = new DerivedProperty(
      [ wavePacket.componentSpacingProperty, continuousWaveformDataSetProperty ],
      ( componentSpacing, continuousWaveformDataSet ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( componentSpacing === 0 ) {
          dataSet = continuousWaveformDataSet;
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<Vector2[]>} Data set for a continuous waveform, displayed when the
    // 'Continuous Wave' checkbox is checked, otherwise [].  Points are ordered by increasing x value.
    this.continuousWaveformDataSetProperty = new DerivedProperty(
      [ this.continuousWaveformVisibleProperty, continuousWaveformDataSetProperty ],
      ( continuousWaveformVisible, continuousWaveformDataSet ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( continuousWaveformVisible ) {
          dataSet = continuousWaveformDataSet;
        }
        return dataSet;
      } );

    // @public {DerivedProperty.<number>} the maximum amplitude, used to scale the chart's y axis.
    // NOTE: It very tempting to do this:
    //   return _.maxBy( [ ...amplitudesDataSet, ...continuousWaveformDataSet ], point => point.y ).y
    // But both data sets may be empty, continuousWaveformDataSet is large when not empty, and
    // performance is an issue. So this implementation is a bit more complicated because we need
    // to avoid using the spread operator, creating additional arrays, etc.
    this.maxAmplitudeProperty = new DerivedProperty(
      [ this.finiteComponentsDataSetProperty, continuousWaveformDataSetProperty ],
      ( amplitudesDataSet, continuousWaveformDataSet ) => {

        // To ensure a non-zero result. That would be an intermediate state, would result in a y-axis range of [0,0],
        // and could cause problems with our bamboo WavePacketAmplitudeChartsNode.
        const epsilon = 1e-6;

        // Find the maxY for amplitudesDataSet, which will be [] if we have infinite components.
        let amplitudesDataSetMaxY = epsilon;
        if ( amplitudesDataSet.length > 0 ) {
          amplitudesDataSetMaxY = _.maxBy( amplitudesDataSet, point => point.y ).y;
        }

        // Find maxY for continuousWaveformDataSet, which will be [] if we have finite components and
        // the 'Continuous Waveform' checkbox is not checked.
        let continuousWaveformDataSetMaxY = epsilon;
        if ( continuousWaveformDataSet.length > 0 ) {
          continuousWaveformDataSetMaxY = _.maxBy( continuousWaveformDataSet, point => point.y ).y;
        }

        return Math.max( amplitudesDataSetMaxY, continuousWaveformDataSetMaxY );
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
   */
  reset() {
    this.chartExpandedProperty.reset();
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
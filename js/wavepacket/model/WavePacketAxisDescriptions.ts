// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketAxisDescriptions is the set of descriptions for the axes of the charts in the 'Wave Packet' screen.
 * There is one AxisDescription for each zoom level, and each array is ordered from most 'zoomed out' to most 'zoomed in'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// The initial x-axis scale for the Components and Sum charts
const DEFAULT_X_AXIS_DESCRIPTION = new AxisDescription( {
  range: new Range( -2, 2 ),
  gridLineSpacing: 0.5,
  tickMarkSpacing: 0.5,
  tickLabelSpacing: 0.5
} );

const WavePacketAxisDescriptions = {

  // Fixed x-axis description for the Amplitudes chart. These are coefficients of PI.
  AMPLITUDES_X_AXIS_DESCRIPTION: new AxisDescription( {
    range: new Range( 0, 24 ),
    gridLineSpacing: 24,
    tickMarkSpacing: 1,
    tickLabelSpacing: 2
  } ),

  DEFAULT_X_AXIS_DESCRIPTION: DEFAULT_X_AXIS_DESCRIPTION,

  // {AxisDescription} x-axis descriptions shared by the Components and Sum charts
  X_AXIS_DESCRIPTIONS: [
    new AxisDescription( {
      range: new Range( -8, 8 ),
      gridLineSpacing: 1,
      tickMarkSpacing: 1,
      tickLabelSpacing: 1
    } ),
    new AxisDescription( {
      range: new Range( -4, 4 ),
      gridLineSpacing: 1,
      tickMarkSpacing: 0.5,
      tickLabelSpacing: 1
    } ),
    DEFAULT_X_AXIS_DESCRIPTION,
    new AxisDescription( {
      range: new Range( -1, 1 ),
      gridLineSpacing: 0.5,
      tickMarkSpacing: 0.1,
      tickLabelSpacing: 0.5
    } ),
    new AxisDescription( {
      range: new Range( -0.5, 0.5 ),
      gridLineSpacing: 0.1,
      tickMarkSpacing: 0.1,
      tickLabelSpacing: 0.1
    } )
  ],

  // {AxisDescription} y-axis descriptions for the Amplitudes chart. These values came from D2CAmplitudesChart.java.
  AMPLITUDES_Y_AXIS_DESCRIPTIONS: [
    new AxisDescription( {
      range: new Range( 0, 1 ),
      gridLineSpacing: 1,
      tickMarkSpacing: 0.5,
      tickLabelSpacing: 1
    } ),
    new AxisDescription( {
      range: new Range( 0, 0.5 ),
      gridLineSpacing: 0.2,
      tickMarkSpacing: 0.1,
      tickLabelSpacing: 0.2
    } ),
    new AxisDescription( {
      range: new Range( 0, 0.05 ),
      gridLineSpacing: 0.05,
      tickMarkSpacing: 0.01,
      tickLabelSpacing: 0.05
    } ),
    new AxisDescription( {
      range: new Range( 0, 0.02 ),
      gridLineSpacing: 0.01,
      tickMarkSpacing: 0.005,
      tickLabelSpacing: 0.01
    } ),
    new AxisDescription( {
      range: new Range( 0, 0.01 ),
      gridLineSpacing: 0.005,
      tickMarkSpacing: 0.001,
      tickLabelSpacing: 0.005
    } )
  ],

  // The Components chart has no y-axis descriptions because it automatically scales to the peak amplitude,
  // and simply puts a tick mark and grid line at that peak amplitude.

  // The fixed y-axis for the Sum chart, see https://github.com/phetsims/fourier-making-waves/issues/159
  SUM_Y_AXIS_DESCRIPTION: new AxisDescription( {
    range: new Range( -1.1, 1.1 ), // a bit of padding added
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } )
};

// There are many assumptions about WavePacketAxisDescriptions. Verify them here.
assert && assert( WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS.includes( WavePacketAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION ),
  'X_AXIS_DESCRIPTIONS must include DEFAULT_X_AXIS_DESCRIPTION' );
assert && assert( AxisDescription.isSortedDescending( WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS ),
  'X_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );
assert && assert( _.every( WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS, axisDescription => axisDescription.hasSymmetricRange() ),
  'range must be symmetric for X_AXIS_DESCRIPTIONS' );
assert && assert( WavePacketAxisDescriptions.SUM_Y_AXIS_DESCRIPTION.hasSymmetricRange(),
  'range must be symmetric for SUM_Y_AXIS_DESCRIPTION' );

fourierMakingWaves.register( 'WavePacketAxisDescriptions', WavePacketAxisDescriptions );
export default WavePacketAxisDescriptions;
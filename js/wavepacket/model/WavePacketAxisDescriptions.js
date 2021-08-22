// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAxisDescriptions is the set of descriptions for the axes of the 'Components' and 'Sum' charts in
 * the 'Wave Packet' screen. There is one AxisDescription for each zoom level, and each array is ordered from
 * most 'zoomed out' to most 'zoomed in'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const DEFAULT_X_AXIS_DESCRIPTION = new AxisDescription( {
  range: new Range( -2, 2 ),
  gridLineSpacing: 0.5,
  tickMarkSpacing: 0.5,
  tickLabelSpacing: 0.5
} );

//TODO this is not really used because of how charts auto-scale
const DEFAULT_Y_AXIS_DESCRIPTION = new AxisDescription( {
  range: new Range( -2, 2 ),
  gridLineSpacing: 1,
  tickMarkSpacing: 1,
  tickLabelSpacing: 1
} );

const WavePacketAxisDescriptions = {

  DEFAULT_X_AXIS_DESCRIPTION: DEFAULT_X_AXIS_DESCRIPTION,
  DEFAULT_Y_AXIS_DESCRIPTION: DEFAULT_Y_AXIS_DESCRIPTION,

  // {AxisDescription}
  // Values for the x-axis AxisDescriptions are coefficients (multipliers) for L or T, depending on which domain is
  // plotted. Use AxisDescription.createRangeForDomain to create a numeric range suitable for use with a chart.
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

  // {AxisDescription} TODO this is not really used because of how charts auto-scale
  Y_AXIS_DESCRIPTIONS: [
    DEFAULT_Y_AXIS_DESCRIPTION
  ]
};

// There are many assumptions about WavePacketAxisDescriptions. Verify them here.
assert && assert( WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS.includes( WavePacketAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION ),
  'X_AXIS_DESCRIPTIONS must include DEFAULT_X_AXIS_DESCRIPTION' );
assert && assert( WavePacketAxisDescriptions.Y_AXIS_DESCRIPTIONS.includes( WavePacketAxisDescriptions.DEFAULT_Y_AXIS_DESCRIPTION ),
  'Y_AXIS_DESCRIPTIONS must include DEFAULT_Y_AXIS_DESCRIPTION' );
assert && assert( AxisDescription.isSortedDescending( WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS ),
  'X_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );
assert && assert( AxisDescription.isSortedDescending( WavePacketAxisDescriptions.Y_AXIS_DESCRIPTIONS ),
  'Y_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );
assert && assert( _.every( WavePacketAxisDescriptions.X_AXIS_DESCRIPTIONS, axisDescription => axisDescription.hasSymmetricRange() ),
  'range must be symmetric for X_AXIS_DESCRIPTIONS' );
assert && assert( _.every( WavePacketAxisDescriptions.Y_AXIS_DESCRIPTIONS, axisDescription => axisDescription.hasSymmetricRange() ),
  'range must be symmetric for Y_AXIS_DESCRIPTIONS' );

fourierMakingWaves.register( 'WavePacketAxisDescriptions', WavePacketAxisDescriptions );
export default WavePacketAxisDescriptions;
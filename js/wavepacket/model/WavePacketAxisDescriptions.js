// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAxisDescriptions is the set of descriptions for the axes of 'Components' and 'Sum' charts in
 * the 'Wave Packet' screen. There is one AxisDescription for each zoom level, and each array is ordered from
 * most 'zoomed out' to most 'zoomed in'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisDescription from '../../common/model/AxisDescription.js';
import DiscreteAxisDescriptions from '../../discrete/model/DiscreteAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const WavePacketAxisDescriptions = {

  // {AxisDescription} Values for the x-axis AxisDescriptions are coefficients (multipliers) for L or T, depending on
  // which domain is * plotted. Use AxisDescription.createRangeForDomain to create a numeric range suitable for use
  // with a chart.
  X_AXIS_DESCRIPTIONS: [
    new AxisDescription( {
      max: 8,
      gridLineSpacing: 1,
      tickMarkSpacing: 1,
      tickLabelSpacing: 1
    } ),
    new AxisDescription( {
      max: 4,
      gridLineSpacing: 1,
      tickMarkSpacing: 0.5,
      tickLabelSpacing: 1
    } ),
    new AxisDescription( {
      max: 2,
      gridLineSpacing: 0.5,
      tickMarkSpacing: 0.5,
      tickLabelSpacing: 0.5
    } ),
    new AxisDescription( {
      max: 1,
      gridLineSpacing: 0.5,
      tickMarkSpacing: 0.1,
      tickLabelSpacing: 0.5
    } ),
    new AxisDescription( {
      max: 0.5,
      gridLineSpacing: 0.1,
      tickMarkSpacing: 0.1,
      tickLabelSpacing: 0.1
    } )
  ],

  // {AxisDescription} TODO flesh out Y_AXIS_DESCRIPTIONS
  Y_AXIS_DESCRIPTIONS: [
    new AxisDescription( {
      max: 2,
      gridLineSpacing: 1,
      tickMarkSpacing: 1,
      tickLabelSpacing: 1
    } )
  ]
};

assert && assert( AxisDescription.isSortedDescending( DiscreteAxisDescriptions.X_AXIS_DESCRIPTIONS ),
  'X_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

assert && assert( AxisDescription.isSortedDescending( DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS ),
  'Y_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

fourierMakingWaves.register( 'WavePacketAxisDescriptions', WavePacketAxisDescriptions );
export default WavePacketAxisDescriptions;
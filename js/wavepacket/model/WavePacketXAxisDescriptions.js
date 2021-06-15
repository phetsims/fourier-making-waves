// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketXAxisDescriptions is the set of descriptions for the x-axes of the Components and Sum charts in the
 * 'Wave Packet' screen.
 *
 * There is one AxisDescription for each zoom level, and the array is ordered from most 'zoomed out' to
 * most 'zoomed in'. Values in the AxisDescriptions are coefficients (multipliers) for L or T, depending
 * on which domain (space, time, space & time) is plotted. Use axisDescription.createAxisRange to create
 * a numeric range suitable for use with a chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisDescription from '../../common/model/AxisDescription.js';
import XAxisDescription from '../../common/model/XAxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// {XAxisDescription[]}
const WavePacketXAxisDescriptions = [
  new XAxisDescription( {
    max: 8,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new XAxisDescription( {
    max: 4,
    gridLineSpacing: 1,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 1
  } ),
  new XAxisDescription( {
    max: 2,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  } ),
  new XAxisDescription( {
    max: 1,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.1,
    tickLabelSpacing: 0.5
  } ),
  new XAxisDescription( {
    max: 0.5,
    gridLineSpacing: 0.1,
    tickMarkSpacing: 0.1,
    tickLabelSpacing: 0.1
  } )
];

assert && assert( AxisDescription.isSortedDescending( WavePacketXAxisDescriptions ),
  'WavePacketXAxisDescriptions must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

assert && assert( _.every( WavePacketXAxisDescriptions, axisDescription => axisDescription.range.getLength() >= 0.5 ),
  'The implementation of y-axis auto-scaling requires that at least 1/2 of the wavelength is always visible. ' +
  'Zooming in on the x-axis violates that requirement.' );

fourierMakingWaves.register( 'WavePacketXAxisDescriptions', WavePacketXAxisDescriptions );
export default WavePacketXAxisDescriptions;
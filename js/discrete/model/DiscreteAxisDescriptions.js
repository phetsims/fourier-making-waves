// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteAxisDescriptions is the set of descriptions for the axes of the Harmonics and Sum chart in the 'Discrete'
 * and 'Wave Game' screens. There is one AxisDescription for each zoom level, and each array is ordered from most
 * 'zoomed out' to most 'zoomed in'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import FMWConstants from '../../common/FMWConstants.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const DiscreteAxisDescriptions = {

  // {AxisDescription[]}
  // Values for the x-axis AxisDescriptions are coefficients (multipliers) for L or T, depending on which domain is
  // plotted. Use AxisDescription.createRangeForDomain to create a numeric range suitable for use with a chart.
  X_AXIS_DESCRIPTIONS: [
    new AxisDescription( {
      range: new Range( -2, 2 ),
      gridLineSpacing: 1 / 8,
      tickMarkSpacing: 1 / 4,
      tickLabelSpacing: 1 / 2
    } ),
    new AxisDescription( {
      range: new Range( -3 / 2, 3 / 2 ),
      gridLineSpacing: 1 / 8,
      tickMarkSpacing: 1 / 4,
      tickLabelSpacing: 1 / 2
    } ),
    new AxisDescription( {
      range: new Range( -1, 1 ),
      gridLineSpacing: 1 / 8,
      tickMarkSpacing: 1 / 4,
      tickLabelSpacing: 1 / 4
    } ),
    new AxisDescription( {
      range: new Range( -3 / 4, 3 / 4 ),
      gridLineSpacing: 1 / 8,
      tickMarkSpacing: 1 / 4,
      tickLabelSpacing: 1 / 4
    } ),
    new AxisDescription( {
      range: new Range( -1 / 2, 1 / 2 ),
      gridLineSpacing: 1 / 8,
      tickMarkSpacing: 1 / 4,
      tickLabelSpacing: 1 / 4
    } ),
    new AxisDescription( {
      range: new Range( -1 / 4, 1 / 4 ),
      gridLineSpacing: 1 / 8,
      tickMarkSpacing: 1 / 4,
      tickLabelSpacing: 1 / 4
    } )
  ],

  // {AxisDescription[]}
  Y_AXIS_DESCRIPTIONS: [
    new AxisDescription( {
      range: new Range( -5, 5 ),
      gridLineSpacing: 1,
      tickMarkSpacing: 5,
      tickLabelSpacing: 5
    } ),
    new AxisDescription( {
      range: new Range( -4, 4 ),
      gridLineSpacing: 1,
      tickMarkSpacing: 2,
      tickLabelSpacing: 2
    } ),
    new AxisDescription( {
      range: new Range( -2, 2 ),
      gridLineSpacing: 1,
      tickMarkSpacing: 1,
      tickLabelSpacing: 1
    } ),
    new AxisDescription( {
      range: new Range( -FMWConstants.MAX_AMPLITUDE, FMWConstants.MAX_AMPLITUDE ),
      gridLineSpacing: 0.5,
      tickMarkSpacing: 0.5,
      tickLabelSpacing: 0.5
    } )
  ]
};

assert && assert( AxisDescription.isSortedDescending( DiscreteAxisDescriptions.X_AXIS_DESCRIPTIONS ),
  'X_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

assert && assert( AxisDescription.isSortedDescending( DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS ),
  'Y_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

assert && assert(
  _.every( DiscreteAxisDescriptions.X_AXIS_DESCRIPTIONS, axisDescription => axisDescription.hasSymmetricRange() ),
  'range must be symmetric for X_AXIS_DESCRIPTIONS' );

assert && assert(
  _.every( DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS, axisDescription => axisDescription.hasSymmetricRange() ),
  'range must be symmetric for Y_AXIS_DESCRIPTIONS' );

assert && assert(
  _.every( DiscreteAxisDescriptions.X_AXIS_DESCRIPTIONS, axisDescription => axisDescription.range.getLength() >= 0.5 ),
  'The implementation of y-axis scaling requires that at least 1/2 of the wavelength is always visible, in order to. ' +
  'find the peak amplitude of one full wavelength of the waveform. Zooming in on the x-axis violates that requirement.' );

//TODO https://github.com/phetsims/fourier-making-waves/issues/18 delete this if we switch to an equation for Waveform.WAVE_PACKET?
assert && assert( DiscreteAxisDescriptions.X_AXIS_DESCRIPTIONS[ 0 ].range.max === 2,
  'Hardcoded points for Waveform.WAVE_PACKET assume that the maximum x-axis multiplier is 2. ' +
  'Did you modify X_AXIS_DESCRIPTIONS?' );

fourierMakingWaves.register( 'DiscreteAxisDescriptions', DiscreteAxisDescriptions );
export default DiscreteAxisDescriptions;
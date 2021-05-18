// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteYAxisDescriptions is the set of descriptions for the y-axes of the Sum charts in the 'Discrete' and
 * 'Wave Game' screens.  These are relevant in the 'Wave Game' screen because the same y-axis scales are desired
 * when auto-scaling the Sum chart for the current challenge.
 *
 * There is one AxisDescription for each zoom level, and the array is ordered from most 'zoomed out' to
 * most 'zoomed in'. Values in the AxisDescriptions are amplitudes (unitless).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FMWConstants from '../../common/FMWConstants.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// {AxisDescription[]}
const DiscreteYAxisDescriptions = [
  new AxisDescription( {
    max: 15,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 10,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 8,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 5,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 4,
    gridLineSpacing: 1,
    tickMarkSpacing: 2,
    tickLabelSpacing: 2
  } ),
  new AxisDescription( {
    max: 3,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    max: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    max: FMWConstants.MAX_AMPLITUDE,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  } )
];

assert && assert( AxisDescription.isSortedDescending( DiscreteYAxisDescriptions ),
  'DiscreteYAxisDescriptions must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

fourierMakingWaves.register( 'DiscreteYAxisDescriptions', DiscreteYAxisDescriptions );
export default DiscreteYAxisDescriptions;
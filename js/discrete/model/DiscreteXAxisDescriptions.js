// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteXAxisDescriptions is the set of descriptions for the x-axes of the Harmonics and Sum charts in the
 * 'Discrete' screen. There is one AxisDescription for each zoom level, and the array is ordered from most 'zoomed out'
 * to most 'zoomed in'. Values in the AxisDescriptions are coefficients (multipliers) for L or T, depending on which
 * domain (space, time, space & time) is plotted.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';

// {AxisDescription[]}
const DiscreteXAxisDescriptions = [
  new AxisDescription( {
    absoluteMax: 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    absoluteMax: 3 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    absoluteMax: 1,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    absoluteMax: 3 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    absoluteMax: 1 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    absoluteMax: 1 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } )
];
assert && assert( AxisDescription.isSortedDescending( DiscreteXAxisDescriptions ),
  'DiscreteXAxisDescriptions must be sorted by descending absoluteMax value' );

assert && assert( DiscreteXAxisDescriptions[ DiscreteXAxisDescriptions.length - 1 ].absoluteMax >= 0.25,
  'The implementation of y-axis auto-scaling requires that at least 1/2 of the wavelength is always visible. ' +
  'Zooming in on the x-axis violates that requirement.' );

fourierMakingWaves.register( 'DiscreteXAxisDescriptions', DiscreteXAxisDescriptions );
export default DiscreteXAxisDescriptions;
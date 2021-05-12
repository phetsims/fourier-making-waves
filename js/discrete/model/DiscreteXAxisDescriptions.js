// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteXAxisDescriptions is the set of descriptions for the x-axes of the Harmonics and Sum charts in the
 * 'Discrete' screen. These are not relevant in the 'Wave Screen' because the x-axes have a fixed scale, and are
 * not zoom-able.
 *
 * There is one AxisDescription for each zoom level, and the array is ordered from most 'zoomed out' to
 * most 'zoomed in'. Values in the AxisDescriptions are coefficients (multipliers) for L or T, depending
 * on which domain (space, time, space & time) is plotted.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';

// {AxisDescription[]}
const DiscreteXAxisDescriptions = [
  new AxisDescription( {
    max: 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    max: 3 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    max: 1,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    max: 3 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    max: 1 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    max: 1 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } )
];

assert && assert( AxisDescription.isSortedDescending( DiscreteXAxisDescriptions ),
  'DiscreteXAxisDescriptions must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

assert && assert( DiscreteXAxisDescriptions[ DiscreteXAxisDescriptions.length - 1 ].range.getLength() >= 0.5,
  'The implementation of y-axis auto-scaling requires that at least 1/2 of the wavelength is always visible. ' +
  'Zooming in on the x-axis violates that requirement.' );

fourierMakingWaves.register( 'DiscreteXAxisDescriptions', DiscreteXAxisDescriptions );
export default DiscreteXAxisDescriptions;
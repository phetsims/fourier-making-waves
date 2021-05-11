// Copyright 2021, University of Colorado Boulder

/**
 * XAxisDescriptions is the set of descriptions for the Harmonics and Sum x-axes in the 'Discrete' screen.
 * There is one AxisDescription for each zoom level.
 * Values in the AxisDescriptions are coefficients (multipliers) for L or T, depending on which domain is plotted.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';

// {AxisDescription[]}
const XAxisDescriptions = [
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
assert && assert( AxisDescription.isSortedDescending( XAxisDescriptions ),
  'XAxisDescriptions must be sorted by descending absoluteMax value' );

assert && assert( XAxisDescriptions[ XAxisDescriptions.length - 1 ].absoluteMax >= 0.25,
  'The implementation of y-axis auto-scaling requires that at least 1/2 of the wavelength is always visible. ' +
  'Zooming in on the x-axis violates that requirement.' );

fourierMakingWaves.register( 'XAxisDescriptions', XAxisDescriptions );
export default XAxisDescriptions;
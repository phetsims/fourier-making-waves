// Copyright 2021, University of Colorado Boulder

/**
 * TickLabelFormat specifies the format of tick mark labels on a chart axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const TickLabelFormat = Enumeration.byKeys( [
  'NUMERIC', // tick labels are numeric values, like 0.5
  'SYMBOLIC' // tick labels are symbolic, like L/2
] );

fourierMakingWaves.register( 'TickLabelFormat', TickLabelFormat );
export default TickLabelFormat;
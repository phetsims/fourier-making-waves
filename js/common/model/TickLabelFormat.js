// Copyright 2021, University of Colorado Boulder

/**
 * TickLabelFormat specifies the format of tick labels on a chart's axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const TickLabelFormat = EnumerationDeprecated.byKeys( [
  'NUMERIC', // tick labels are numeric values, like 0.5
  'SYMBOLIC' // tick labels are symbolic, like L/2
] );

fourierMakingWaves.register( 'TickLabelFormat', TickLabelFormat );
export default TickLabelFormat;
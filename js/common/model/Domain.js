// Copyright 2020-2021, University of Colorado Boulder

/**
 * Domain identifies the independent variables in the function that describes the Fourier series.
 * In the view, the Domain determines the presentation of the x axis for charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const Domain = EnumerationDeprecated.byKeys( [
  'SPACE',         // F(x)
  'TIME',          // F(t)
  'SPACE_AND_TIME' // F(x,t)
] );

fourierMakingWaves.register( 'Domain', Domain );
export default Domain;
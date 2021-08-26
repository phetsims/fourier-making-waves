// Copyright 2020-2021, University of Colorado Boulder

/**
 * Domain identifies the independent variables in the function that describes the Fourier series.
 * In the view, the domain determines the presentation of the x axis for charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const Domain = Enumeration.byKeys( [
  'SPACE',         // F(x)
  'TIME',          // F(t)
  'SPACE_AND_TIME' // F(x,t)
] );

fourierMakingWaves.register( 'Domain', Domain );
export default Domain;
// Copyright 2020, University of Colorado Boulder

/**
 * Domain identifies the independent variables in the function that describes the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const Domain = Enumeration.byKeys( [ 'SPACE', 'TIME', 'SPACE_AND_TIME' ] );

fourierMakingWaves.register( 'Domain', Domain );
export default Domain;
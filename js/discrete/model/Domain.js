// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const Domain = Enumeration.byKeys( [ 'SPACE', 'TIME', 'SPACE_AND_TIME' ] );

fourierMakingWaves.register( 'Domain', Domain );
export default Domain;
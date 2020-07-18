// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const WaveType = Enumeration.byKeys( [ 'SINE', 'COSINE' ] );

fourierMakingWaves.register( 'WaveType', WaveType );
export default WaveType;
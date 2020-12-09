// Copyright 2020, University of Colorado Boulder

//TODO need a better name for this
/**
 * WaveType indicates whether the waveform is being approximated using sines or cosines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const WaveType = Enumeration.byKeys( [ 'SINE', 'COSINE' ] );

fourierMakingWaves.register( 'WaveType', WaveType );
export default WaveType;
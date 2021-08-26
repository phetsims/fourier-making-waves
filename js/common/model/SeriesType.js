// Copyright 2020-2021, University of Colorado Boulder

/**
 * SeriesType indicates the form of the Fourier series, whether the waveform is being approximated using sines or cosines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const SeriesType = Enumeration.byKeys( [ 'SINE', 'COSINE' ] );

fourierMakingWaves.register( 'SeriesType', SeriesType );
export default SeriesType;
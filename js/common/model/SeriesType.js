// Copyright 2020-2021, University of Colorado Boulder

/**
 * SeriesType indicates the type of the Fourier series. There are 2 types of Fourier series, referred to in the
 * literature as 'sine series' and 'cosine series', depending on whether the waveform is being approximated using
 * sines or cosines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const SeriesType = Enumeration.byKeys( [ 'SINE', 'COSINE' ] );

fourierMakingWaves.register( 'SeriesType', SeriesType );
export default SeriesType;
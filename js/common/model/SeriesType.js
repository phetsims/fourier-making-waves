// Copyright 2020-2022, University of Colorado Boulder

/**
 * SeriesType indicates the type of the Fourier series. There are 2 types of Fourier series, referred to in the
 * literature as 'sine series' and 'cosine series', depending on whether the waveform is being approximated using
 * sines or cosines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// 'SIN' and 'COS' are used to correspond to 'sin' and 'cos' used for radio-button labels.
const SeriesType = EnumerationDeprecated.byKeys( [ 'SIN', 'COS' ] );

fourierMakingWaves.register( 'SeriesType', SeriesType );
export default SeriesType;
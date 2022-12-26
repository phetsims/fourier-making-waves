// Copyright 2020-2022, University of Colorado Boulder

/**
 * SeriesType indicates the type of the Fourier series. There are 2 types of Fourier series, referred to in the
 * literature as 'sine series' and 'cosine series', depending on whether the waveform is being approximated using
 * sines or cosines.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class SeriesType extends EnumerationValue {

  // 'SIN' and 'COS' are used to correspond to 'sin' and 'cos' used for radio-button labels.
  public static readonly SIN = new SeriesType();
  public static readonly COS = new SeriesType();

  public static readonly enumeration = new Enumeration( SeriesType );
}

fourierMakingWaves.register( 'SeriesType', SeriesType );
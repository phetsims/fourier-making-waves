// Copyright 2020-2022, University of Colorado Boulder

/**
 * Domain identifies the independent variables in the function that describes the Fourier series.
 * In the view, the Domain determines the presentation of the x axis for charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class Domain extends EnumerationValue {

  public static readonly SPACE = new Domain(); // F(x)
  public static readonly TIME = new Domain(); // F(t)
  public static readonly SPACE_AND_TIME = new Domain(); // F(x,t)

  public static readonly enumeration = new Enumeration( Domain );
}

fourierMakingWaves.register( 'Domain', Domain );
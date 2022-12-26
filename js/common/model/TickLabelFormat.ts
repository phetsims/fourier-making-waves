// Copyright 2021-2022, University of Colorado Boulder

/**
 * TickLabelFormat specifies the format of tick labels on a chart's axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class TickLabelFormat extends EnumerationValue {

  public static readonly NUMERIC = new TickLabelFormat(); // tick labels are numeric values, like 0.5
  public static readonly SYMBOLIC = new TickLabelFormat(); // tick labels are symbolic, like L/2

  public static readonly enumeration = new Enumeration( TickLabelFormat );
}

fourierMakingWaves.register( 'TickLabelFormat', TickLabelFormat );
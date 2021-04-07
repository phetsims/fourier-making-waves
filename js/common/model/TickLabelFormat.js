// Copyright 2020, University of Colorado Boulder

/**
 * TickLabelFormat specifies the format of tick mark labels on a chart axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const TickLabelFormat = Enumeration.byKeys( [ 'NUMERIC', 'SYMBOLIC' ] );

fourierMakingWaves.register( 'TickLabelFormat', TickLabelFormat );
export default TickLabelFormat;
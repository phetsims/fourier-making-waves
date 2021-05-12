// Copyright 2021, University of Colorado Boulder

/**
 * XAxisDescription is a specialization of AxisDescription for the x axis.  For the x axis, AxisDescription contains
 * coefficients to be applied to L or T, depending on which domain is being plotted.  This class adds functionality
 * to create an actual numeric range for the x axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';

class XAxisDescription extends AxisDescription {

  /**
   * @param {Object} config
   */
  constructor( config ) {
    super( config );
  }

  /**
   * Creates the range for the x-axis. For the x axis, AxisDescription contains coefficients to be applied to L or T,
   * depending on which domain is being plotted.
   * @param {Domain} domain
   * @param {number} L - wavelength of the fundamental harmonic, in m
   * @param {number} T - period of the fundamental harmonic, in
   * @returns {Range}
   * @public
   */
  createAxisRange( domain, L, T ) {

    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( typeof L === 'number' && L > 0, 'invalid L' );
    assert && assert( typeof T === 'number' && T > 0, 'invalid T' );

    const value = ( domain === Domain.TIME ) ? T : L;
    const xMin = value * this.range.min;
    const xMax = value * this.range.max;
    return new Range( xMin, xMax );
  }
}

fourierMakingWaves.register( 'XAxisDescription', XAxisDescription );
export default XAxisDescription;
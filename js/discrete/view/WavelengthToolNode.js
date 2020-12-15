// Copyright 2020, University of Colorado Boulder

/**
 * WavelengthToolNode is the tool used to measure the wavelength of a specific harmonic in the 'space' and
 * 'space & time' domains.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import LengthToolNode from './LengthToolNode.js';

class WavelengthToolNode extends LengthToolNode {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic[]} harmonics
   * @param {Property.<number>} orderProperty - order of the harmonic to display
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, orderProperty, domainProperty, visibleProperty, dragBounds, options ) {
    super( chartTransform, FMWSymbols.lambda, harmonics, orderProperty, domainProperty, visibleProperty, dragBounds,
      harmonic => FMWConstants.L / harmonic.order,
      ( domain, visible ) => ( domain !== Domain.TIME ) && visible,
      options );
  }
}

fourierMakingWaves.register( 'WavelengthToolNode', WavelengthToolNode );
export default WavelengthToolNode;
// Copyright 2020, University of Colorado Boulder

/**
 * PeriodToolNode is the tool used to measure the period of a specific harmonic in the 'time' domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import LengthToolNode from './LengthToolNode.js';

class PeriodToolNode extends LengthToolNode {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic[]} harmonics
   * @param {Property.<number>} orderProperty - order of the harmonic to display
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} selectedProperty
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, orderProperty, domainProperty, selectedProperty, dragBounds, options ) {
    super( chartTransform, FMWSymbols.T, harmonics, orderProperty, domainProperty, selectedProperty, dragBounds,
      harmonic => FMWConstants.T / harmonic.order,
      ( domain, selected ) => ( domain === Domain.TIME ) && selected,
      options );
  }
}

fourierMakingWaves.register( 'PeriodToolNode', PeriodToolNode );
export default PeriodToolNode;
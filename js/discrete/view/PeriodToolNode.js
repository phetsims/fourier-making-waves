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
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} orderProperty - order of the harmonic to display
   * @param {Property.<boolean>} selectedProperty - whether the tool is selected
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, domainProperty, orderProperty, selectedProperty, dragBoundsProperty, options ) {
    super( FMWSymbols.T, chartTransform, harmonics, domainProperty, orderProperty, selectedProperty, dragBoundsProperty,
      harmonic => FMWConstants.T / harmonic.order,
      ( selected, domain ) => selected && ( domain === Domain.TIME ),
      options );
  }
}

fourierMakingWaves.register( 'PeriodToolNode', PeriodToolNode );
export default PeriodToolNode;
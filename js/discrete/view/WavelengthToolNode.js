// Copyright 2020, University of Colorado Boulder

/**
 * WavelengthToolNode is the tool used to measure the wavelength of a specific harmonic in the 'space' and
 * 'space & time' domains.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import LengthToolNode from './LengthToolNode.js';

class WavelengthToolNode extends LengthToolNode {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic[]} harmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} orderProperty - order of the harmonic to display
   * @param {Property.<boolean>} selectedProperty - whether the tool is selected
   * @param {Property.<Harmonic|null>} emphasizedHarmonicProperty
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, domainProperty, orderProperty, selectedProperty, emphasizedHarmonicProperty, dragBoundsProperty, options ) {
    super( FMWSymbols.lambda, chartTransform, harmonics, domainProperty, orderProperty, selectedProperty,
      emphasizedHarmonicProperty, dragBoundsProperty,
      harmonic => harmonic.wavelength,
      ( selected, domain ) => selected && ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME ),
      options );
  }
}

fourierMakingWaves.register( 'WavelengthToolNode', WavelengthToolNode );
export default WavelengthToolNode;
// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavelengthCalipersNode is the tool used to measure a harmonic's wavelength in the 'space' and 'space & time' Domains.
 * Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import merge from '../../../../phet-core/js/merge.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import DiscreteCalipersNode from './DiscreteCalipersNode.js';

export default class WavelengthCalipersNode extends DiscreteCalipersNode {

  /**
   * @param {DiscreteModel} model
   * @param {ChartTransform} chartTransform - transform for the Harmonics chart
   * @param {Object} [options]
   */
  constructor( model, chartTransform, options ) {

    assert && assert( model instanceof DiscreteModel );
    assert && assert( chartTransform instanceof ChartTransform );

    options = merge( {

      // DiscreteCalipersNode options
      debugName: 'wavelengthCalipers'
    }, options );

    super(
      model.wavelengthTool,
      model.fourierSeries.harmonics,
      model.harmonicsChart.emphasizedHarmonics,
      chartTransform,
      model.domainProperty,
      [ Domain.SPACE, Domain.SPACE_AND_TIME ], // relevant Domains
      harmonic => harmonic.wavelength, // gets the quantity of Harmonic that is being measured
      options
    );
  }
}

fourierMakingWaves.register( 'WavelengthCalipersNode', WavelengthCalipersNode );
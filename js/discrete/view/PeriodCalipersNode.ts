// Copyright 2020-2023, University of Colorado Boulder

/**
 * PeriodCalipersNode is the tool used to measure a harmonic's period in the time Domain on the 'Discrete' screen.
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

export default class PeriodCalipersNode extends DiscreteCalipersNode {

  /**
   * @param {DiscreteModel} model
   * @param {ChartTransform} chartTransform
   * @param {Object} [options]
   */
  constructor( model, chartTransform, options ) {

    assert && assert( model instanceof DiscreteModel );
    assert && assert( chartTransform instanceof ChartTransform );

    options = merge( {

      // DiscreteCalipersNode options
      debugName: 'periodCalipers'
    }, options );

    super(
      model.periodTool,
      model.fourierSeries.harmonics,
      model.harmonicsChart.emphasizedHarmonics,
      chartTransform,
      model.domainProperty,
      [ Domain.TIME ], // relevant Domains
      harmonic => harmonic.period, // gets the quantity of Harmonic that is being measured
      options
    );
  }
}

fourierMakingWaves.register( 'PeriodCalipersNode', PeriodCalipersNode );
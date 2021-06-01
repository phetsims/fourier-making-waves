// Copyright 2020-2021, University of Colorado Boulder

/**
 * PeriodCalipersNode is the tool used to measure a harmonic's period in the 'time' domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import CalipersNode from './CalipersNode.js';

class PeriodCalipersNode extends CalipersNode {

  /**
   * @param {DiscreteModel} model
   * @param {ChartTransform} chartTransform
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {Object} [options]
   */
  constructor( model, chartTransform, visibleBoundsProperty, options ) {

    assert && assert( model instanceof DiscreteModel );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );

    options = merge( {

      // CalipersNode options
      debugName: 'periodCalipers'
    }, options );

    // Model properties that we'll be using.
    const tool = model.periodTool;
    const harmonics = model.fourierSeries.harmonics;
    const emphasizedHarmonics = model.harmonicsChart.emphasizedHarmonics;
    const domainProperty = model.domainProperty;

    super( tool, harmonics, emphasizedHarmonics, chartTransform, visibleBoundsProperty, domainProperty,
      [ Domain.TIME ], // relevant Domains
      harmonic => harmonic.period, // gets the quantity of Harmonic that is being measured
      options );
  }
}

fourierMakingWaves.register( 'PeriodCalipersNode', PeriodCalipersNode );
export default PeriodCalipersNode;
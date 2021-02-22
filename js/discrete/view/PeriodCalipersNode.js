// Copyright 2020, University of Colorado Boulder

/**
 * PeriodCalipersNode is the tool used to measure a harmonic's period in the 'time' domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';
import CalipersNode from './CalipersNode.js';

class PeriodCalipersNode extends CalipersNode {

  /**
   * @param {DiscreteModel} model
   * @param {ChartTransform} chartTransform
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {Object} [options]
   */
  constructor( model, chartTransform, visibleBoundsProperty, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );

    options = merge( {
      debugName: 'periodCalipers'
    }, options );

    // Model properties that we'll be using - these were formerly constructor params.
    const harmonics = model.fourierSeries.harmonics;
    const emphasizedHarmonics = model.harmonicsChart.emphasizedHarmonics;
    const orderProperty = model.periodTool.orderProperty;
    const selectedProperty = model.periodTool.isSelectedProperty;
    const domainProperty = model.domainProperty;

    super( FMWSymbols.T, harmonics, emphasizedHarmonics, orderProperty, chartTransform, visibleBoundsProperty,
      harmonic => harmonic.period, // gets the quantity of Harmonic that is being measured
      options );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ selectedProperty, domainProperty ],
      ( selected, domain ) => {
        this.interruptSubtreeInput();
        this.visible = ( selected && ( domain === Domain.TIME ) );
      } );
  }
}

fourierMakingWaves.register( 'PeriodCalipersNode', PeriodCalipersNode );
export default PeriodCalipersNode;
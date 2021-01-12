// Copyright 2020, University of Colorado Boulder

/**
 * PeriodToolNode is the tool used to measure the period of a specific harmonic in the 'time' domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';
import WidthToolNode from './WidthToolNode.js';

class PeriodToolNode extends WidthToolNode {

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

    super( FMWSymbols.T,
      model.fourierSeries.harmonics, model.chartsModel.emphasizedHarmonics, model.periodToolOrderProperty,
      chartTransform, visibleBoundsProperty,
      harmonic => harmonic.period, // gets the quantity of Harmonic that is being measured
      options );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ model.periodToolSelectedProperty, model.domainProperty ],
      ( selected, domain ) => {
        this.interruptDrag();
        this.visible = ( selected && ( domain === Domain.TIME ) );
      } );
  }
}

fourierMakingWaves.register( 'PeriodToolNode', PeriodToolNode );
export default PeriodToolNode;
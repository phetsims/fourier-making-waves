// Copyright 2020, University of Colorado Boulder

/**
 * ContinuousChartsModel is the model for charts in the 'Continuous' screen.
 * An instance of this sub-model is instantiated by ContinuousModel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ContinuousChartsModel {

  constructor() {

    // @public whether the Components chart is visible
    this.componentsChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart is visible
    this.sumChartVisibleProperty = new BooleanProperty( true );

    // @private
    this.resetContinuousChartsModel = () => {

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetContinuousChartsModel();
  }
}

fourierMakingWaves.register( 'ContinuousChartsModel', ContinuousChartsModel );
export default ContinuousChartsModel;
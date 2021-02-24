// Copyright 2020, University of Colorado Boulder

/**
 * ContinuousChartsModel is the model for charts in the 'Continuous' screen.
 * An instance of this sub-model is instantiated by ContinuousModel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ContinuousChartsModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public whether the Components chart is visible
    this.componentsChartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'componentsChartVisibleProperty' )
    } );

    // @public whether the Sum chart is visible
    this.sumChartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'sumChartVisibleProperty' )
    } );

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
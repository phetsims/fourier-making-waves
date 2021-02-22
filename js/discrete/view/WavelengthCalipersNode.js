// Copyright 2020, University of Colorado Boulder

/**
 * WavelengthCalipersNode is the tool used to measure a harmonic's wavelength in the 'space' and 'space & time' domains.
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

class WavelengthCalipersNode extends CalipersNode {

  /**
   * @param {DiscreteModel} model
   * @param {ChartTransform} chartTransform - transform for the Harmonics chart
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {Object} [options]
   */
  constructor( model, chartTransform, visibleBoundsProperty, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );

    options = merge( {
      debugName: 'wavelengthCalipers'
    }, options );

    // Model properties that we'll be using - these were formerly constructor params.
    const harmonics = model.fourierSeries.harmonics;
    const emphasizedHarmonics = model.harmonicsChart.emphasizedHarmonics;
    const selectedProperty = model.wavelengthTool.isSelectedProperty;
    const orderProperty = model.wavelengthTool.orderProperty;
    const domainProperty = model.domainProperty;

    super( FMWSymbols.lambda, harmonics, emphasizedHarmonics, orderProperty, chartTransform, visibleBoundsProperty,
      harmonic => harmonic.wavelength, // gets the quantity of Harmonic that is being measured
      options );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ selectedProperty, domainProperty ],
      ( selected, domain ) => {
        this.interruptSubtreeInput();
        this.visible = ( selected && ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME ) );
      } );
  }
}

fourierMakingWaves.register( 'WavelengthCalipersNode', WavelengthCalipersNode );
export default WavelengthCalipersNode;
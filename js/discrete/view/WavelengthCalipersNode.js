// Copyright 2020, University of Colorado Boulder

/**
 * WavelengthCalipersNode is the tool used to measure a harmonic's wavelength in the 'space' and 'space & time' domains.
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

class WavelengthCalipersNode extends CalipersNode {

  /**
   * @param {DiscreteModel} model
   * @param {ChartTransform} chartTransform - transform for the Harmonics chart
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {Object} [options]
   */
  constructor( model, chartTransform, visibleBoundsProperty, options ) {

    assert && assert( model instanceof DiscreteModel );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );

    options = merge( {

      // CalipersNode options
      debugName: 'wavelengthCalipers'
    }, options );

    // Model properties that we'll be using - these were formerly constructor params.
    const tool = model.wavelengthTool;
    const harmonics = model.fourierSeries.harmonics;
    const emphasizedHarmonics = model.harmonicsChart.emphasizedHarmonics;
    const domainProperty = model.domainProperty;

    super( tool, harmonics, emphasizedHarmonics, chartTransform, visibleBoundsProperty,
      domainProperty,
      [ Domain.SPACE, Domain.SPACE_AND_TIME ], // relevant Domains
      harmonic => harmonic.wavelength, // gets the quantity of Harmonic that is being measured
      options );
  }
}

fourierMakingWaves.register( 'WavelengthCalipersNode', WavelengthCalipersNode );
export default WavelengthCalipersNode;
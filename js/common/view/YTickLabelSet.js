// Copyright 2021, University of Colorado Boulder

/**
 * YTickLabelSet implements the y-axis tick labels for the Harmonics and Sum charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

class YTickLabelSet extends LabelSet {

  /**
   * @param {ChartTransform} chartTransform
   * @param {number} spacing
   * @param {Object} [options]
   */
  constructor( chartTransform, spacing, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPositiveNumber( spacing );

    options = merge( {

      // YTickLabelSet options
      decimalPlaces: 1,

      // LabelSet options
      edge: 'min'
    }, options );

    assert && assert( !options.createLabel, 'YTickLabelSet sets createLabel' );
    options.createLabel = value => new Text( Utils.toFixedNumber( value, options.decimalPlaces ), {
      font: FMWConstants.TICK_LABEL_FONT
    } );

    super( chartTransform, Orientation.VERTICAL, spacing, options );
  }
}

fourierMakingWaves.register( 'YTickLabelSet', YTickLabelSet );
export default YTickLabelSet;
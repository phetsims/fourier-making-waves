// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousAmplitudesChartNode is the 'Amplitudes' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';

//TODO placeholder
class ContinuousAmplitudesChartNode extends Node {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} continuousWaveformVisibleProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, continuousWaveformVisibleProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( continuousWaveformVisibleProperty, 'boolean' );

    options = merge( {

      // ChartTransform options
      transformOptions: {
        modelXRange: new Range( 0, 1 ),
        modelYRange: new Range( 0, 1 ),
        viewWidth: 100,
        viewHeight: 100
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // the transform from model to view coordinates
    const chartTransform = new ChartTransform( options.transformOptions );

    const chartRectangle = new ChartRectangle( chartTransform, {
      stroke: FMWColorProfile.chartGridLinesStrokeProperty,
      fill: 'white',
      tandem: options.tandem.createTandem( 'chartRectangle' )
    } );

    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 50, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox( continuousWaveformVisibleProperty, {
      right: chartRectangle.right - 5,
      top: chartRectangle.bottom + 5,
      tandem: options.tandem.createTandem( 'continuousWaveformCheckbox' )
    } );

    assert && assert( !options.children );
    options.children = [
      chartRectangle,
      xAxisLabel,
      continuousWaveformCheckbox
    ];

    super( options );

    domainProperty.link( domain => {
      xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.xAxisLabel, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.radiansPerMeter :
               fourierMakingWavesStrings.units.radiansPerMillisecond
      } );
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.bottom = chartRectangle.bottom;
    } );
  }
}

fourierMakingWaves.register( 'ContinuousAmplitudesChartNode', ContinuousAmplitudesChartNode );
export default ContinuousAmplitudesChartNode;
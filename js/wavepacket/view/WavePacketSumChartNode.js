// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumChartNode is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketSumChart from '../model/WavePacketSumChart.js';
import WaveformEnvelopeCheckbox from './WaveformEnvelopeCheckbox.js';

class WavePacketSumChartNode extends Node {

  /**
   * @param {WavePacketSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof WavePacketSumChart );

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

    // x axis ---------------------------------------------------------

    //TODO duplicated from ComponentsChartNode
    const xAxis = new Line( 0, 0, options.transformOptions.viewWidth, 0, {
      stroke: FMWColorProfile.axisStrokeProperty,
      lineWidth: 1,
      center: chartRectangle.center
    } );

    //TODO duplicated from ComponentsChartNode
    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 60, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // y axis ---------------------------------------------------------

    //TODO duplicated from ComponentsChartNode
    const yAxis = new Line( 0, 0, 0, options.transformOptions.viewHeight, {
      stroke: FMWColorProfile.axisStrokeProperty,
      lineWidth: 1,
      center: chartRectangle.center
    } );

    //TODO duplicated from ComponentsChartNode
    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    // Addition UI components ---------------------------------------------------------

    const waveformEnvelopeCheckbox = new WaveformEnvelopeCheckbox( sumChart.envelopeVisibleProperty, {
      right: chartRectangle.right - 5,
      top: chartRectangle.bottom + 10,
      tandem: options.tandem.createTandem( 'waveformEnvelopeCheckbox' )
    } );

    assert && assert( !options.children );
    options.children = [
      chartRectangle,
      xAxis, xAxisLabel,
      yAxis, yAxisLabel,
      waveformEnvelopeCheckbox
    ];

    super( options );

    //TODO duplicated from ComponentsChartNode
    // Adjust the x-axis label to match the domain.
    // unlink is not needed.
    sumChart.domainProperty.link( domain => {
      xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.xAxisLabel, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.meters :
               fourierMakingWavesStrings.units.milliseconds
      } );
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.centerY = chartRectangle.centerY;
    } );

    // @public for layout
    this.chartRectangle = chartRectangle;

    // pdom - traversal order
    this.pdomOrder = [
      //TODO x-axis zoom button group
      waveformEnvelopeCheckbox
    ];
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketSumChartNode', WavePacketSumChartNode );
export default WavePacketSumChartNode;
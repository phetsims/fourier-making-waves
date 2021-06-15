// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChartNode is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
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
import WavePacketAmplitudesChart from '../model/WavePacketAmplitudesChart.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';

// constants
//TODO duplicated in WaveformChartNode
const TICK_MARK_OPTIONS = {
  edge: 'min',
  extent: 6
};

//TODO placeholder
class WavePacketAmplitudesChartNode extends Node {

  /**
   * @param {WavePacketAmplitudesChart} amplitudesChart
   * @param {Object} [options]
   */
  constructor( amplitudesChart, options ) {

    assert && assert( amplitudesChart instanceof WavePacketAmplitudesChart );

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

    const xAxis = new Line( 0, 0, options.transformOptions.viewWidth, 0, {
      stroke: FMWColorProfile.axisStrokeProperty,
      lineWidth: 1
    } );

    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI, TICK_MARK_OPTIONS );

    const xTickLabels = new LabelSet( chartTransform, Orientation.HORIZONTAL, 2 * Math.PI, {
      createLabel: createXTickLabel,
      edge: 'min'
    } );

    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 60, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // y axis ---------------------------------------------------------

    const yAxis = new Line( 0, 0, 0, options.transformOptions.viewHeight, {
      stroke: FMWColorProfile.axisStrokeProperty,
      lineWidth: 1,
      centerX: chartRectangle.left,
      centerY: chartRectangle.centerY
    } );

    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    // Addition UI components ---------------------------------------------------------

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox( amplitudesChart.continuousWaveformVisibleProperty, {
      right: chartRectangle.right - 5,
      top: xTickLabels.bottom + 8,
      tandem: options.tandem.createTandem( 'continuousWaveformCheckbox' )
    } );

    assert && assert( !options.children );
    options.children = [
      xTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxis, xAxisLabel, xTickLabels,
      yAxis, yAxisLabel,
      continuousWaveformCheckbox
    ];

    super( options );

    // Adjust the x-axis label to match the domain.
    // unlink is not needed.
    amplitudesChart.domainProperty.link( domain => {
      xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.xAxisLabel, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.radiansPerMeter :
               fourierMakingWavesStrings.units.radiansPerMillisecond
      } );
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.bottom = chartRectangle.bottom;
    } );

    // @public for layout
    this.chartRectangle = chartRectangle;

    // pdom - traversal order
    this.pdomOrder = [
      continuousWaveformCheckbox
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

/**
 * Creates the label for an x-axis tick mark.
 * @param {number} value
 * @returns {Node}
 */
function createXTickLabel( value ) {
  const coefficient = Utils.toFixedNumber( value / Math.PI, 0 );
  const string = ( coefficient === 0 ) ? '0' : `${coefficient}${FMWSymbols.pi}`;
  return new RichText( string, {
    font: FMWConstants.TICK_LABEL_FONT,
    maxWidth: 20
  } );
}

fourierMakingWaves.register( 'WavePacketAmplitudesChartNode', WavePacketAmplitudesChartNode );
export default WavePacketAmplitudesChartNode;
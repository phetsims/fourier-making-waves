// Copyright 2021, University of Colorado Boulder

//TODO most of this is duplicated from ComponentsChartNode
/**
 * WavePacketSumChartNode is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
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
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import FMWZoomButtonGroup from '../../common/view/FMWZoomButtonGroup.js';
import XTickLabelSet from '../../common/view/XTickLabelSet.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketSumChart from '../model/WavePacketSumChart.js';
import WaveformEnvelopeCheckbox from './WaveformEnvelopeCheckbox.js';

//TODO duplicated in WaveformChartNode
const TICK_MARK_OPTIONS = {
  edge: 'min',
  extent: 6
};

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

    // Fields of interest in componentsChart, to improve readability
    const L = sumChart.wavePacket.L;
    const T = sumChart.wavePacket.T;
    const domainProperty = sumChart.domainProperty;
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;

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
      lineWidth: 1,
      center: chartRectangle.center
    } );

    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 60, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL,
      xAxisDescriptionProperty.value.tickMarkSpacing, TICK_MARK_OPTIONS );

    const xTickLabels = new XTickLabelSet( chartTransform, xAxisDescriptionProperty.value.tickLabelSpacing,
      domainProperty, new EnumerationProperty( TickLabelFormat, TickLabelFormat.NUMERIC ), L, T );

    const xZoomButtonGroup = new FMWZoomButtonGroup( sumChart.xAxisDescriptionProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      touchAreaXDilation: 5,
      touchAreaYDilation: 10,
      left: chartRectangle.right + 6,
      bottom: chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
    } );

    // unmultilink is not needed.
    Property.multilink(
      [ xAxisDescriptionProperty, domainProperty ],
      ( xAxisDescription, domain ) => {
        const value = ( domain === Domain.TIME ) ? T : L;
        const xMin = value * xAxisDescription.range.min;
        const xMax = value * xAxisDescription.range.max;
        chartTransform.setModelXRange( new Range( xMin, xMax ) );
        xTickMarks.setSpacing( xAxisDescription.tickMarkSpacing * value );
        xTickLabels.setSpacing( xAxisDescription.tickLabelSpacing * value );
        xTickLabels.invalidateLabelSet();
      } );

    // y axis ---------------------------------------------------------

    const yAxis = new Line( 0, 0, 0, options.transformOptions.viewHeight, {
      stroke: FMWColorProfile.axisStrokeProperty,
      lineWidth: 1,
      center: chartRectangle.center
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

    const waveformEnvelopeCheckbox = new WaveformEnvelopeCheckbox( sumChart.envelopeVisibleProperty, {
      right: chartRectangle.right - 5,
      top: xTickLabels.bottom + 8,
      tandem: options.tandem.createTandem( 'waveformEnvelopeCheckbox' )
    } );

    assert && assert( !options.children );
    options.children = [
      xTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxis, xAxisLabel, xTickLabels, xZoomButtonGroup,
      yAxis, yAxisLabel,
      waveformEnvelopeCheckbox
    ];

    super( options );

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
      xZoomButtonGroup,
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
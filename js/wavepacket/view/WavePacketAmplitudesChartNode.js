// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChartNode is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarPlot from '../../../../bamboo/js/BarPlot.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWChartNode from '../../common/view/FMWChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketAmplitudesChart from '../model/WavePacketAmplitudesChart.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';

// constants
const X_TICK_LABEL_DECIMALS = 0;
const Y_TICK_LABEL_DECIMALS = 2;

// range for the grayscale fill of bars in the BarPlot
const BAR_RGB_RANGE = new Range( 0, 230 );
assert && assert( BAR_RGB_RANGE.min >= 0 && BAR_RGB_RANGE.min <= 255 );
assert && assert( BAR_RGB_RANGE.max >= 0 && BAR_RGB_RANGE.max <= 255 );

class WavePacketAmplitudesChartNode extends FMWChartNode {

  /**
   * @param {WavePacketAmplitudesChart} amplitudesChart
   * @param {Object} [options]
   */
  constructor( amplitudesChart, options ) {

    assert && assert( amplitudesChart instanceof WavePacketAmplitudesChart );

    // Fields of interest in amplitudesChart, to improve readability
    const domainProperty = amplitudesChart.domainProperty;
    const continuousWaveformVisibleProperty = amplitudesChart.continuousWaveformVisibleProperty;
    const barPlotDataSetProperty = amplitudesChart.barPlotDataSetProperty;
    const continuosWaveformDataSetProperty = amplitudesChart.continuosWaveformDataSetProperty;
    const xRange = amplitudesChart.fourierSeries.xRange;

    options = merge( {
      xTickMarkSpacing: Math.PI,
      xTickLabelSpacing: 2 * Math.PI,
      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createPiTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( options );

    // No x-axis grid lines for this chart.
    this.xGridLines.visible = false;

    const barPlot = new BarPlot( this.chartTransform, [], {
      barWidth: 5,

      // Assign a grayscale color to each bar in barPlot.
      pointToPaintableFields: point => {
        let rgb = BAR_RGB_RANGE.min + BAR_RGB_RANGE.getLength() * point.x / xRange.max;
        rgb = BAR_RGB_RANGE.constrainValue( rgb );
        return { fill: Color.grayColor( rgb ) };
      }
    } );

    const continuousWaveformPlot = new LinePlot( this.chartTransform, [], {
      stroke: Color.grayColor( 192 ), // ENVELOPE_COLOR in D2CAmplitudesView.java
      lineWidth: 4 // ENVELOPE_STROKE in D2CAmplitudesView.java
    } );

    // Clip barPlot to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ continuousWaveformPlot, barPlot ]
    } );
    this.addChild( clipNode );

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox( continuousWaveformVisibleProperty, {
      right: this.chartRectangle.right - 5,
      top: this.xTickLabels.bottom + 8
    } );
    this.addChild( continuousWaveformCheckbox );

    // Adjust the x-axis label to match the domain.
    domainProperty.link( domain => {

      // Update the label. Note that units are on a separate line so that this label takes up less horizontal space.
      this.xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolBreakUnits, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.radiansPerMeter :
               fourierMakingWavesStrings.units.radiansPerMillisecond
      } );
    } );

    // Display the Fourier component amplitudes.
    barPlotDataSetProperty.link( dataSet => barPlot.setDataSet( dataSet ) );

    // Display the continuous waveform, and scale the y axis to fit.
    continuosWaveformDataSetProperty.link( dataSet => {
      continuousWaveformPlot.setDataSet( dataSet );
      this.scaleYAxis( dataSet );
    } );

    amplitudesChart.continuousWaveformVisibleProperty.link( visible => {
      continuousWaveformPlot.visible = visible;
    } );

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

  /**
   * Scales the y axis to fit the data set.
   * @param {Vector2[]} dataSet
   * @private
   */
  scaleYAxis( dataSet ) {
    assert && assert( dataSet.length > 0 );

    // Extend the range, so there's some space above maxY.
    const maxY = _.maxBy( dataSet, point => point.y ).y;
    this.chartTransform.setModelYRange( new Range( 0, 1.05 * maxY ) );

    // Adjust ticks and gridlines.
    // This logic and values were taken from D2CAmplitudesChart.java, in the Java version.
    //TODO should this use AxisDescription, and amplitudesChart.yAxisDescriptionProperty, like other charts?
    let tickLabelSpacing;
    let tickMarkSpacing;
    if ( maxY > 1 ) {
      tickLabelSpacing = 1.0;
      tickMarkSpacing = 0.5;
    }
    else if ( maxY > 0.5 ) {
      tickLabelSpacing = 0.2;
      tickMarkSpacing = 0.1;
    }
    else if ( maxY > 0.2 ) {
      tickLabelSpacing = 0.1;
      tickMarkSpacing = 0.05;
    }
    else if ( maxY > 0.05 ) {
      tickLabelSpacing = 0.05;
      tickMarkSpacing = 0.01;
    }
    else if ( maxY > 0.02 ) {
      tickLabelSpacing = 0.01;
      tickMarkSpacing = 0.005;
    }
    else {
      tickLabelSpacing = 0.005;
      tickMarkSpacing = 0.001;
    }
    assert && assert( tickLabelSpacing > 0 );
    assert && assert( tickMarkSpacing > 0 );

    this.yGridLines.setSpacing( tickLabelSpacing );
    this.yTickLabels.setSpacing( tickLabelSpacing );
    this.yTickMarks.setSpacing( tickMarkSpacing );
  }
}

fourierMakingWaves.register( 'WavePacketAmplitudesChartNode', WavePacketAmplitudesChartNode );
export default WavePacketAmplitudesChartNode;
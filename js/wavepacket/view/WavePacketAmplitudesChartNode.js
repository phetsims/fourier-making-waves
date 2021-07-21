// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChartNode is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarPlot from '../../../../bamboo/js/BarPlot.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWChartNode from '../../common/view/FMWChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketAmplitudesChart from '../model/WavePacketAmplitudesChart.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';

// constants
const X_TICK_LABEL_DECIMALS = 0;
const Y_TICK_LABEL_DECIMALS = 3;

class WavePacketAmplitudesChartNode extends FMWChartNode {

  /**
   * @param {WavePacketAmplitudesChart} amplitudesChart
   * @param {Object} [options]
   */
  constructor( amplitudesChart, options ) {

    assert && assert( amplitudesChart instanceof WavePacketAmplitudesChart );

    // Fields of interest in amplitudesChart, to improve readability
    const xRange = amplitudesChart.wavePacket.xRange;
    const domainProperty = amplitudesChart.domainProperty;
    const continuousWaveformVisibleProperty = amplitudesChart.continuousWaveformVisibleProperty;
    const barPlotDataSetProperty = amplitudesChart.barPlotDataSetProperty;

    options = merge( {
      xGridLineSpacing: xRange.max,
      xTickMarkSpacing: Math.PI,
      xTickLabelSpacing: 2 * Math.PI,
      xLabelSetOptions: {
        createLabel: value => FMWChartNode.createPiTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => FMWChartNode.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );


    super( options );

    //TODO how to assign a different color to each bar, or use a gradient for the BarPlot?
    const barPlot = new BarPlot( this.chartTransform, [], {
      barWidth: 5
    } );

    // Clip barPlot to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ barPlot ]
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

    // Display the data set for the BarPlot.
    barPlotDataSetProperty.link( dataSet => {

      // Update the bar plot.
      barPlot.setDataSet( dataSet );

      // Autoscale the y axis.
      if ( dataSet.length > 0 ) {

        // Extend the range, so there's some space above maxY.
        const maxY = amplitudesChart.getBarPlotMaxY();
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
}

fourierMakingWaves.register( 'WavePacketAmplitudesChartNode', WavePacketAmplitudesChartNode );
export default WavePacketAmplitudesChartNode;
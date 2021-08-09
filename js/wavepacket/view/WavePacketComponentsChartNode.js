// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChartNode is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import FMWColors from '../../common/FMWColors.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import WaveformChartNode from '../../common/view/WaveformChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketComponentsChart from '../model/WavePacketComponentsChart.js';

// constants
const X_TICK_LABEL_DECIMALS = 1;
const Y_TICK_LABEL_DECIMALS = 2;
const GRAY_RANGE = FMWColors.FOURIER_COMPONENT_GRAY_RANGE;

class WavePacketComponentsChartNode extends WaveformChartNode {

  /**
   * @param {WavePacketComponentsChart} componentsChart
   * @param {Object} [options]
   */
  constructor( componentsChart, options ) {

    assert && assert( componentsChart instanceof WavePacketComponentsChart );

    // Fields of interest in componentsChart, to improve readability
    const xAxisDescriptionProperty = componentsChart.xAxisDescriptionProperty;
    const componentSpacingProperty = componentsChart.wavePacket.componentSpacingProperty;

    options = merge( {
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( componentsChart, options );

    // Render the plots using Canvas, clipped to chartRectangle.
    // Remember! When any of the associated plots is updated, you must call chartCanvasNode.update().
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // Message shown when we have an infinite number of components.
    const messageNode = new BackgroundNode( new Text( fourierMakingWavesStrings.infiniteComponentsCannotBePlotted, {
      font: new PhetFont( 18 ),
      maxWidth: 0.75 * this.chartRectangle.width
    } ), {
      xMargin: 12,
      yMargin: 6,
      center: this.chartRectangle.center
    } );
    this.addChild( messageNode );

    // When we have an infinite number of components...
    componentSpacingProperty.link( componentSpacing => {
      const hasInfiniteComponents = ( componentSpacing === 0 );

      // Show the '...cannot be plotted' message.
      messageNode.visible = hasInfiniteComponents;

      // Hide some chart elements.
      chartCanvasNode.visible = !hasInfiniteComponents;
      this.yGridLines.visible = !hasInfiniteComponents;
      this.yTickMarks.visible = !hasInfiniteComponents;
      this.yTickLabels.visible = !hasInfiniteComponents;
    } );

    // Update the plot for each component.
    componentsChart.componentDataSetsProperty.link( componentDataSets => {

      const numberOfComponents = componentDataSets.length;
      if ( numberOfComponents > 0 ) {

        const plots = chartCanvasNode.painters;
        const numberOfPlots = plots.length;

        // The maximum amplitude, for autoscaling the y axis.
        let maxAmplitude = 0;

        for ( let i = 0; i < numberOfComponents; i++ ) {

          const dataSet = componentDataSets[ i ];
          assert && assert( dataSet.length > 0 );

          // Inspect this component for maximum amplitude.
          maxAmplitude = Math.max( maxAmplitude, _.maxBy( dataSet, point => point.y ).y );

          // Gray to be used to stroke this component
          const rgb = GRAY_RANGE.constrainValue( GRAY_RANGE.min + GRAY_RANGE.getLength() * i / numberOfComponents );
          const stroke = Color.grayColor( rgb );

          if ( i < numberOfPlots ) {

            // Reuse an existing plot.
            const plot = plots[ i ];
            plot.setDataSet( dataSet );
            plot.setStroke( stroke );
          }
          else {

            // Create a new plot.
            const plot = new CanvasLinePlot( this.chartTransform, dataSet, {
              stroke: stroke
            } );
            chartCanvasNode.painters.push( plot );
          }
        }

        // Any unused plots get an empty data set, so that they draw nothing.
        if ( numberOfComponents < numberOfPlots ) {
          for ( let i = numberOfComponents; i < numberOfPlots; i++ ) {
            const plot = plots[ i ];
            if ( plot.dataSet.length > 0 ) {
              plot.setDataSet( [] );
            }
          }
        }

        // Reverse the order of plots, so that lower-order components (darker gray) are rendered last,
        // and therefore appear on top. If we don't do this, then the higher-order components (lighter gray)
        // will wash out the chart, reducing the contrast.
        chartCanvasNode.painters.reverse();

        // Autoscale the y axis.
        // See https://github.com/phetsims/fourier-making-waves/issues/117 for decisions about ticks and grid lines.
        const maxY = 1.1 * maxAmplitude; // add a bit of padding
        this.chartTransform.setModelYRange( new Range( -maxY, maxY ) );
        this.yGridLines.setSpacing( maxAmplitude );
        this.yTickMarks.setSpacing( maxAmplitude );
        this.yTickLabels.setSpacing( maxAmplitude );

        // Clip to the range [-maxAmplitude,maxAmplitude], to trim rendering anomalies that occur when zoomed out.
        // See https://github.com/phetsims/fourier-making-waves/issues/121
        chartCanvasNode.clipArea =
          WavePacketComponentsChartNode.computeClipArea( maxAmplitude, this.chartTransform, this.chartRectangle );

        // Redraw the plots.
        chartCanvasNode.update();
      }
    } );
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
   * Computes the clipArea that will trim any data that is outside the y-axis range [-maxAmplitude,maxAmplitude].
   * This is used to trim anomalies that occur when the x-axis is zoomed way out.
   * See https://github.com/phetsims/fourier-making-waves/issues/121
   * @param {number} maxAmplitude
   * @param {ChartTransform} chartTransform
   * @param {ChartRectangle} chartRectangle
   * @returns {Shape}
   * @public
   * @static
   */
  static computeClipArea( maxAmplitude, chartTransform, chartRectangle ) {

    assert && assert( typeof maxAmplitude === 'number' && maxAmplitude > 0 );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && assert( chartRectangle instanceof ChartRectangle );

    const chartRectangleBounds = chartRectangle.bounds;
    const x1 = chartRectangleBounds.left;
    const x2 = chartRectangleBounds.right;
    const rangeHeight = chartTransform.modelToViewY( -maxAmplitude ) - chartTransform.modelToViewY( maxAmplitude );
    const yTrim = ( chartRectangleBounds.height - rangeHeight ) / 2;
    const y1 = chartRectangleBounds.top + yTrim;
    const y2 = chartRectangleBounds.bottom - yTrim;
    return Shape.bounds( new Bounds2( x1, y1, x2, y2 ) );
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChartNode', WavePacketComponentsChartNode );
export default WavePacketComponentsChartNode;
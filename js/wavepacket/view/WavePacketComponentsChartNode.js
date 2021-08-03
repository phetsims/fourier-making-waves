// Copyright 2021, University of Colorado Boulder

//TODO should plots be added in reverse order, so that the fundamental is in the foreground, as in Java version?
/**
 * WavePacketComponentsChartNode is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
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

    // Message shown when we have an infinite number of components.
    const messageNode = new Text( fourierMakingWavesStrings.infiniteComponentsCannotBePlotted, {
      font: new PhetFont( 18 ),
      center: this.chartRectangle.center,
      maxWidth: 0.75 * this.chartRectangle.width
    } );
    this.addChild( messageNode );

    // Render the plots using Canvas, clipped to chartRectangle.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // When we have an infinite number of components...
    componentSpacingProperty.link( componentSpacing => {
      const hasInfiniteComponents = ( componentSpacing === 0 );

      // Show the '...cannot be plotted' message.
      messageNode.visible = hasInfiniteComponents;

      // Hide some chart elements.
      chartCanvasNode.visible = !hasInfiniteComponents;
      this.xAxis.visible = !hasInfiniteComponents;
      this.yAxis.visible = !hasInfiniteComponents;
      this.xGridLines.visible = !hasInfiniteComponents;
      this.xTickMarks.visible = !hasInfiniteComponents;
      this.xTickLabels.visible = !hasInfiniteComponents;
      this.yGridLines.visible = !hasInfiniteComponents;
      this.yTickMarks.visible = !hasInfiniteComponents;
      this.yTickLabels.visible = !hasInfiniteComponents;

      // Disable the x-axis zoom buttons
      this.xZoomButtonGroup.enabled = !hasInfiniteComponents;
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
            plot.stroke = stroke;
          }
          else {

            // Create a new plot.
            const plot = new CanvasLinePlot( this.chartTransform, dataSet, {
              stroke: Color.grayColor( rgb )
            } );
            chartCanvasNode.painters.push( plot );
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
        }

        // Autoscale the y axis.
        maxAmplitude = 1.1 * maxAmplitude; // add a bit of padding
        this.chartTransform.setModelYRange( new Range( -maxAmplitude, maxAmplitude ) );
        this.yGridLines.setSpacing( maxAmplitude );
        this.yTickMarks.setSpacing( maxAmplitude );
        this.yTickLabels.setSpacing( maxAmplitude );
        phet.log && phet.log( `Components chart modelYRange = ${this.chartTransform.modelYRange}` );

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
}

fourierMakingWaves.register( 'WavePacketComponentsChartNode', WavePacketComponentsChartNode );
export default WavePacketComponentsChartNode;
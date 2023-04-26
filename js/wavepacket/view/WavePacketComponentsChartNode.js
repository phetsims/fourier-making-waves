// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketComponentsChartNode is the view for the 'Fourier Components' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text } from '../../../../scenery/js/imports.js';
import FMWColors from '../../common/FMWColors.js';
import DomainChartNode from '../../common/view/DomainChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WavePacketComponentsChart from '../model/WavePacketComponentsChart.js';

// constants
const X_TICK_LABEL_DECIMALS = 1;
const Y_TICK_LABEL_DECIMALS = 2;
const GRAY_RANGE = FMWColors.FOURIER_COMPONENT_GRAY_RANGE;

export default class WavePacketComponentsChartNode extends DomainChartNode {

  /**
   * @param {WavePacketComponentsChart} componentsChart
   * @param {Object} [options]
   */
  constructor( componentsChart, options ) {

    assert && assert( componentsChart instanceof WavePacketComponentsChart );
    assert && assert( options && options.tandem );

    // Fields of interest in componentsChart, to improve readability
    const xAxisDescriptionProperty = componentsChart.xAxisDescriptionProperty;
    const componentDataSetsProperty = componentsChart.componentDataSetsProperty;

    options = merge( {
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty, options.tandem.createTandem( 'xZoomLevelProperty' ) ),
      xTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( componentsChart, options );

    // Render the plots using Canvas.
    // Remember! When any of the associated plots is updated, you must call update().
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [] );
    this.addChild( chartCanvasNode );

    // Message shown when we have an infinite number of components.
    const messageNode = new BackgroundNode(
      new Text( FourierMakingWavesStrings.infiniteComponentsCannotBePlottedStringProperty, {
        font: new PhetFont( 18 ),
        maxWidth: 0.75 * this.chartRectangle.width
      } ), {
        xMargin: 12,
        yMargin: 6
      } );
    this.addChild( messageNode );
    messageNode.boundsProperty.link( bounds => {
      messageNode.enter = this.chartRectangle.center;
    } );

    componentDataSetsProperty.link( componentDataSets => {

      // When we have infinite components, componentDataSets cannot be populated and will be [].
      const hasInfiniteComponents = ( componentDataSets.length === 0 );

      // Show the '...cannot be plotted' message.
      messageNode.visible = hasInfiniteComponents;

      // Hide all component plots.
      chartCanvasNode.visible = !hasInfiniteComponents;

      // Hide some chart elements.
      this.yGridLines.visible = !hasInfiniteComponents;
      this.yTickMarks.visible = !hasInfiniteComponents;
      this.yTickLabels.visible = !hasInfiniteComponents;

      // Update the plot for each component.
      if ( hasInfiniteComponents ) {

        // Do nothing. While we could set the data set to [] for every CanvasLinePlot, that would be a performance hit.
        // Instead, chartCanvasNode.visible is set to false (see above) when we have infinite components.
      }
      else {
        const plots = chartCanvasNode.painters;
        const numberOfPlots = plots.length;

        // The peak amplitude, for scaling the y axis.
        let peakAmplitude = 0;

        const numberOfComponents = componentDataSets.length;
        for ( let i = 0; i < numberOfComponents; i++ ) {

          const dataSet = componentDataSets[ i ];
          assert && assert( dataSet.length > 0 );

          // Inspect this component for peak amplitude.
          peakAmplitude = Math.max( peakAmplitude, _.maxBy( dataSet, point => point.y ).y );

          // Gray to be used to stroke this component
          const rgb = GRAY_RANGE.constrainValue( GRAY_RANGE.min + GRAY_RANGE.getLength() * i / numberOfComponents );
          const stroke = Color.grayColor( rgb );

          if ( i < numberOfPlots ) {

            // Reuse an existing plot.
            const plot = plots[ i ];
            assert && assert( plot instanceof CanvasLinePlot );
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

        // Scale the y axis, with a little padding above/below the peak.
        const maxY = 1.1 * peakAmplitude;
        this.chartTransform.setModelYRange( new Range( -maxY, maxY ) );
        this.yGridLines.setSpacing( peakAmplitude );
        this.yTickMarks.setSpacing( peakAmplitude );
        this.yTickLabels.setSpacing( peakAmplitude );

        // Clip to the range [-peakAmplitude,peakAmplitude], to trim rendering anomalies that occur when zoomed out.
        // See https://github.com/phetsims/fourier-making-waves/issues/121
        chartCanvasNode.clipArea = this.computeClipAreaForAmplitudeRange( -peakAmplitude, peakAmplitude );

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
}

fourierMakingWaves.register( 'WavePacketComponentsChartNode', WavePacketComponentsChartNode );
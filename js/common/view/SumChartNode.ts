// Copyright 2020-2023, University of Colorado Boulder

/**
 * SumChartNode is the view base class for the 'Sum' chart in the 'Discrete' and 'Wave Game' screens.
 * It creates and manages the plot for the sum of harmonics in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColors from '../FMWColors.js';
import SumChart from '../model/SumChart.js';
import DomainChartNode, { DomainChartNodeOptions } from './DomainChartNode.js';
import { ProfileColorProperty } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {

  // This would be a logical place to use nested sumPlotOptions. But CanvasLinePlot does not support Property for
  // stroke, so the only thing nestable is lineWidth.  That doesn't seem like a big win, so I chose to use flat
  // options.
  sumPlotStrokeProperty?: ProfileColorProperty;
  sumPlotLineWidth?: number;
};

export type SumChartNodeOptions = SelfOptions & PickRequired<DomainChartNodeOptions, 'tandem'>;

export default class SumChartNode extends DomainChartNode {

  protected readonly chartCanvasNode: ChartCanvasNode;
  protected readonly sumPlot: CanvasLinePlot;

  protected constructor( sumChart: SumChart, providedOptions: SumChartNodeOptions ) {

    // Fields of interest in sumChart, to improve readability
    const amplitudesProperty = sumChart.fourierSeries.amplitudesProperty;
    const sumDataSetProperty = sumChart.sumDataSetProperty;
    const yAxisRangeProperty = sumChart.yAxisRangeProperty;
    const yAxisDescriptionProperty = sumChart.yAxisDescriptionProperty;

    const options = optionize<SumChartNodeOptions, SelfOptions, DomainChartNodeOptions>()( {

      // SelfOptions
      sumPlotStrokeProperty: FMWColors.sumPlotStrokeProperty,
      sumPlotLineWidth: 1,

      // DomainChartNodeOptions
      chartTransformOptions: {
        // modelXRange is handled by superclass DomainChartNode
        modelYRange: yAxisDescriptionProperty.value.range
      }
    }, providedOptions );

    super( sumChart, options );

    // Plot that shows the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, sumDataSetProperty.value, {
      stroke: options.sumPlotStrokeProperty.value,
      lineWidth: options.sumPlotLineWidth
    } );

    // Draw the sum plot using Canvas, clipped to chartRectangle.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // CanvasLinePlot does not allow stroke to be a Property, so we have to manage changes ourselves.
    options.sumPlotStrokeProperty.lazyLink( stroke => {
      sumPlot.setStroke( stroke );
      chartCanvasNode.update();
    } );

    // Display the data set.
    sumDataSetProperty.lazyLink( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );

    // Hide the plot when the sum is zero (all amplitudes are zero)
    amplitudesProperty.link( amplitudes => {
      sumPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );

    // Update the y-axis range.
    yAxisRangeProperty.link( range => this.chartTransform.setModelYRange( range ) );

    // Update the y-axis decorations.
    yAxisDescriptionProperty.link( yAxisDescription => {
      // NOTE: this.chartTransform.setModelYRange is handled via yAxisRangeProperty listener, above.
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    this.chartCanvasNode = chartCanvasNode; // {ChartCanvasNode}
    this.sumPlot = sumPlot; // {CanvasLinePlot}
  }
}

fourierMakingWaves.register( 'SumChartNode', SumChartNode );
// Copyright 2020-2023, University of Colorado Boulder

/**
 * HarmonicsChartNode is the view base class for the 'Harmonics' chart in the 'Discrete' and 'Wave Game' screens.
 * It creates and manages a plot for each harmonic in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import HarmonicPlot from '../../discrete/view/HarmonicPlot.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import HarmonicsChart from '../model/HarmonicsChart.js';
import DomainChartNode, { DomainChartNodeOptions } from './DomainChartNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const NORMAL_LINE_WIDTH = 1;
const EMPHASIZED_LINE_WIDTH = 2;
const DE_EMPHASIZED_LINE_WIDTH = 0.5;
const DE_EMPHASIZED_STROKE = Color.grayColor( 150 );

type SelfOptions = EmptySelfOptions;

export type HarmonicsChartNodeOptions = SelfOptions & DomainChartNodeOptions;

export default class HarmonicsChartNode extends DomainChartNode {

  public constructor( harmonicsChart: HarmonicsChart, providedOptions: HarmonicsChartNodeOptions ) {

    // Fields of interest in harmonicsChart, to improve readability
    const harmonics = harmonicsChart.fourierSeries.harmonics;
    const harmonicDataSetProperties = harmonicsChart.harmonicDataSetProperties;
    const emphasizedHarmonics = harmonicsChart.emphasizedHarmonics;
    const yAxisDescription = harmonicsChart.yAxisDescription;

    const options = optionize<HarmonicsChartNodeOptions, SelfOptions, DomainChartNodeOptions>()( {

      // DomainChartNodeOptions
      chartTransformOptions: {
        modelYRange: yAxisDescription.range
      },
      yGridLineSpacing: yAxisDescription.gridLineSpacing,
      yTickMarkSpacing: yAxisDescription.tickMarkSpacing,
      yTickLabelSpacing: yAxisDescription.tickLabelSpacing
    }, providedOptions );

    super( harmonicsChart, options );

    // a plot for each harmonic in the Fourier series, in harmonic order, rendered using Canvas
    const plots: HarmonicPlot[] = [];
    assert && assert( harmonics.length === harmonicDataSetProperties.length, 'a data set is required for each harmonic' );
    for ( let i = 0; i < harmonics.length; i++ ) {
      plots.push( new HarmonicPlot( this.chartTransform, harmonics[ i ], harmonicDataSetProperties[ i ] ) );
    }

    // Render the plots using Canvas, clipped to chartRectangle.
    // Reverse the order, so that the fundamental is rendered last and is therefore in the foreground.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, plots.slice().reverse(), {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // When any plot changes, redraw the entire Canvas.
    const plotChangedListener = () => chartCanvasNode.update();
    plots.forEach( plot => plot.changedEmitter.addListener( plotChangedListener ) );

    // Visually emphasize harmonics, see https://github.com/phetsims/fourier-making-waves/issues/31
    const emphasizedHarmonicsChangedListener = () => {
      plots.forEach( plot => {
        const harmonic = plot.harmonic;
        if ( emphasizedHarmonics.length === 0 ) {

          // No emphasis, all plots have their normal color and lineWidth.
          plot.lineWidth = NORMAL_LINE_WIDTH;
          plot.setStroke( harmonic.colorProperty.value );
        }
        else {

          // Emphasize some plots, de-emphasize other plots.
          if ( emphasizedHarmonics.includesHarmonic( harmonic ) ) {
            plot.lineWidth = EMPHASIZED_LINE_WIDTH;
            plot.setStroke( harmonic.colorProperty.value );
          }
          else {
            plot.lineWidth = DE_EMPHASIZED_LINE_WIDTH;
            plot.setStroke( DE_EMPHASIZED_STROKE );
          }
        }
      } );
      chartCanvasNode.update();
    };
    emphasizedHarmonics.addChangedListener( emphasizedHarmonicsChangedListener );
  }
}

fourierMakingWaves.register( 'HarmonicsChartNode', HarmonicsChartNode );
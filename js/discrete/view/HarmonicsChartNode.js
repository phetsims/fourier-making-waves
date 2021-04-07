// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen. It renders a plot for each of
 * the harmonics in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import EquationForm from '../model/EquationForm.js';
import HarmonicsChart from '../model/HarmonicsChart.js';
import DiscreteChartNode from './DiscreteChartNode.js';
import HarmonicPlot from './HarmonicPlot.js';

// constants
const NORMAL_LINE_WIDTH = 1;
const EMPHASIZED_LINE_WIDTH = 2;
const DE_EMPHASIZED_LINE_WIDTH = 0.5;
const DE_EMPHASIZED_STROKE = Color.grayColor( 150 );

class HarmonicsChartNode extends DiscreteChartNode {

  /**
   * @param {HarmonicsChart} harmonicsChart
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( harmonicsChart, equationFormProperty, options ) {

    assert && assert( harmonicsChart instanceof HarmonicsChart, 'invalid harmonicsChart' );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Fields of interest in harmonicsChart, to improve readability
    const fourierSeries = harmonicsChart.fourierSeries;
    const harmonics = fourierSeries.harmonics;
    const domainProperty = harmonicsChart.domainProperty;
    const harmonicDataSetProperties = harmonicsChart.harmonicDataSetProperties;
    assert && assert( harmonics.length === harmonicDataSetProperties.length,
      'a data set is required for each harmonic' );
    const emphasizedHarmonics = harmonicsChart.emphasizedHarmonics;
    const xZoomLevelProperty = harmonicsChart.xZoomLevelProperty;
    const xAxisDescriptionProperty = harmonicsChart.xAxisDescriptionProperty;

    super( fourierSeries.L, fourierSeries.T, domainProperty, xZoomLevelProperty, xAxisDescriptionProperty,
      equationFormProperty, options );

    // {HarmonicPlot[]} a plot for each harmonic in the Fourier series, in harmonic order, rendered using Canvas
    const plots = [];
    for ( let i = 0; i < harmonics.length; i++ ) {
      plots.push( new HarmonicPlot( this.chartTransform, harmonics[ i ], harmonicDataSetProperties[ i ] ) );
    }

    // Render the plots using Canvas, clipped to chartRectangle.
    // Reverse the order, so that the fundamental is rendered last and is therefore in the foreground.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, plots.slice().reverse(), {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );
    this.addChild( chartCanvasNode );

    // When any plot changes, redraw the entire Canvas. unlink is not needed.
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
    emphasizedHarmonics.addChangedListener( emphasizedHarmonicsChangedListener ); // removeChangedListener is not needed
  }
}

fourierMakingWaves.register( 'HarmonicsChartNode', HarmonicsChartNode );
export default HarmonicsChartNode;
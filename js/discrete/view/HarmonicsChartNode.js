// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen. It renders a plot for each of
 * the harmonics in the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import HarmonicsChartModel from '../model/HarmonicsChartModel.js';
import Waveform from '../model/Waveform.js';
import DiscreteChartNode from './DiscreteChartNode.js';
import HarmonicPlot from './HarmonicPlot.js';

// constants
const NORMAL_LINE_WIDTH = 1;
const EMPHASIZED_LINE_WIDTH = 2;
const DE_EMPHASIZED_LINE_WIDTH = 0.5;
const DE_EMPHASIZED_STROKE = Color.grayColor( 150 );

class HarmonicsChartNode extends DiscreteChartNode {

  /**
   * @param {HarmonicsChartModel} harmonicsChartModel
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( harmonicsChartModel, fourierSeries, waveformProperty, domainProperty, equationFormProperty, options ) {

    assert && assert( harmonicsChartModel instanceof HarmonicsChartModel, 'invalid harmonicsChartModel' );
    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const harmonics = fourierSeries.harmonics;

    // Fields of interest in harmonicsChartModel, to improve readability
    const harmonicDataSetProperties = harmonicsChartModel.harmonicDataSetProperties;
    assert && assert( harmonics.length === harmonicDataSetProperties.length,
      'a data set is required for each harmonic' );
    const emphasizedHarmonics = harmonicsChartModel.emphasizedHarmonics;
    const xZoomLevelProperty = harmonicsChartModel.xZoomLevelProperty;
    const xAxisDescriptionProperty = harmonicsChartModel.xAxisDescriptionProperty;

    super( fourierSeries, domainProperty, equationFormProperty, xZoomLevelProperty, xAxisDescriptionProperty, options );

    // {HarmonicPlot[]} a plot for each harmonic in the Fourier series, in harmonic order, rendered using Canvas
    const plots = [];
    for ( let i = 0; i < harmonics.length; i++ ) {
      plots.push( new HarmonicPlot( this.chartTransform, harmonics[ i ], harmonicDataSetProperties[ i ] ) );
    }

    // Render the plots using Canvas, clipped to chartRectangle.
    // Reverse the order, so that the fundamental is rendered last and is therefore in the foreground.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, plots.slice().reverse(), {
      clipArea: this.chartRectangle.getShape()
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
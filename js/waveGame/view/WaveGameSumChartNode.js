// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameSumChartNode is the view for the 'Sum' chart in the 'Wave Game' screen. Rendering of the sum for the
 * challenge answer is delegated to SumChartNode, which is capable of rendering the sum for one Fourier series.
 * This class is responsible for rendering the sum for the challenge guess, the amplitudes entered by the user.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWColors from '../../common/FMWColors.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameSumChart from '../model/WaveGameSumChart.js';

class WaveGameSumChartNode extends SumChartNode {

  /**
   * @param {WaveGameSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {
    assert && assert( sumChart instanceof WaveGameSumChart );

    options = merge( {

      // SumChartNode options
      sumPlotStrokeProperty: FMWColors.answerSumStrokeProperty,
      sumPlotLineWidth: 4
    }, options );

    super( sumChart, options );

    // Plot that shows the sum for the answer
    const guessPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: FMWColors.guessSumStrokeProperty.value,
      lineWidth: 1.5
    } );

    // CanvasLinePlot does not allow stroke to be a Property, so we have to manage changes ourselves.
    FMWColors.guessSumStrokeProperty.link( stroke => {
      guessPlot.stroke = stroke;
      this.chartCanvasNode.update();
    } );

    this.chartCanvasNode.setPainters( [ this.sumPlot, guessPlot ] );

    // Keep the guess plot synchronized with the model. unlink is not needed.
    sumChart.guessDataSetProperty.link( dataSet => {
      guessPlot.setDataSet( dataSet );
      this.chartCanvasNode.update();
    } );

    // Hide the guess plot when the sum is zero (all amplitudes are zero)
    sumChart.guessSeries.amplitudesProperty.link( amplitudes => {
      guessPlot.visible = _.some( amplitudes, amplitude => amplitude !== 0 );
    } );
  }
}

fourierMakingWaves.register( 'WaveGameSumChartNode', WaveGameSumChartNode );
export default WaveGameSumChartNode;
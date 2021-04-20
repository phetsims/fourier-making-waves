// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameSumChartNode is the view for the 'Sum' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import SumChartNode from '../../common/view/SumChartNode.js';
import Waveform from '../../discrete/model/Waveform.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameSumChart from '../model/WaveGameSumChart.js';

class WaveGameSumChartNode extends SumChartNode {

  /**
   * @param {WaveGameSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {
    assert && assert( sumChart instanceof WaveGameSumChart, 'invalid sumChart' );

    options = merge( {
      sumPlotStrokeProperty: FMWColorProfile.answerSumStrokeProperty,
      sumPlotLineWidth: 4
    }, options );

    super( sumChart, new Property( TickLabelFormat.NUMERIC ), new EnumerationProperty( Waveform, Waveform.CUSTOM ), options );

    // Plot that shows the sum for the answer
    const guessPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: FMWColorProfile.guessSumStrokeProperty.value,
      lineWidth: 1.5
    } );

    // CanvasLinePlot does not allow stroke to be a Property, so we have to manage changes ourselves.
    FMWColorProfile.guessSumStrokeProperty.link( stroke => {
      guessPlot.stroke = stroke;
      this.chartCanvasNode.update();
    } );

    this.chartCanvasNode.setPainters( [ this.sumPlot, guessPlot ] );

    // Keep the guess plot synchronized with the model. unlink is not needed.
    sumChart.guessDataSetProperty.link( dataSet => {
      guessPlot.setDataSet( dataSet );
      this.chartCanvasNode.update();
    } );
  }
}

fourierMakingWaves.register( 'WaveGameSumChartNode', WaveGameSumChartNode );
export default WaveGameSumChartNode;
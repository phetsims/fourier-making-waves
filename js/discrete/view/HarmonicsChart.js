// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsChart is the 'Harmonics' chart in the 'Discrete' screen. It renders a plot for each of the harmonics in
 * the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FWMConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import WaveType from '../model/WaveType.js';
import ZoomDescription from '../model/ZoomDescription.js';
import DiscreteChart from './DiscreteChart.js';
import HarmonicsEquationNode from './HarmonicsEquationNode.js';

// constants

//TODO compute this dynamically, so that fewer points are needed as we zoom in.
// Number of points in the data set for each plot. This value was chosen empirically, such that the highest order
// harmonic looks smooth when the chart is fully zoomed out.
const POINTS_PER_PLOT = 2000;

class HarmonicsChart extends DiscreteChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<ZoomDescription>} xZoomDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, waveTypeProperty, mathFormProperty, xZoomLevelProperty, xZoomDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( xZoomLevelProperty instanceof NumberProperty, 'invalid xZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( xZoomDescriptionProperty, ZoomDescription );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( fourierSeries, domainProperty, mathFormProperty, xZoomLevelProperty, xZoomDescriptionProperty, options );

    // Equation that appears above the chart
    const equationNode = new HarmonicsEquationNode( domainProperty, waveTypeProperty, mathFormProperty, {
      maxWidth: 0.5 * this.chartRectangle.width,
      tandem: options.tandem.createTandem( 'equationNode' ),
      phetioReadOnly: true
    } );
    this.addChild( equationNode );

    //TODO this is not working as expected with stringTest=long
    // Center the equation above the chart.
    equationNode.localBoundsProperty.link( () => {
      equationNode.centerX = this.chartRectangle.centerX;
      equationNode.bottom = this.chartRectangle.top - 5;
    } );

    // {LinePlot[]} a plot for each harmonic in the Fourier series
    const harmonicPlots = [];

    // @public {Property.<Vector2[]>} data set for the sum of the harmonics, drawn by the Sum chart
    this.sumDataSetProperty = new Property( [] );

    // Updates the data set for the sum
    const updateSum = () => {
      const relevantHarmonicPlots = harmonicPlots.slice( 0, fourierSeries.numberOfHarmonicsProperty.value );
      this.sumDataSetProperty.value = createSumDataSet( relevantHarmonicPlots );
    };

    // Updates the data set for one harmonic
    const updateOneHarmonic = ( harmonic, harmonicPlot ) => {
      assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
      assert && assert( harmonicPlot instanceof LinePlot, 'invalid harmonicPlot' );

      //TODO https://github.com/phetsims/fourier-making-waves/issues/23 do we want to show 0 amplitudes? Java version does not.
      // Show plots for relevant harmonics with non-zero amplitude.
      harmonicPlot.visible = ( harmonic.amplitudeProperty.value !== 0 ) &&
                             ( harmonic.order <= fourierSeries.numberOfHarmonicsProperty.value );

      if ( harmonic.order <= fourierSeries.numberOfHarmonicsProperty.value ) {

        // Create the data set for a relevant harmonic.
        harmonicPlot.setDataSet( createHarmonicDataSet( harmonic.order, harmonic.amplitudeProperty.value,
          this.chartModel.modelXRange, domainProperty.value, waveTypeProperty.value ) );
      }
      else {

        // Empty an data set for a harmonic that is not relevant.
        harmonicPlot.setDataSet( [] );
      }
    };

    // Updates the data sets for all harmonics, then updates the data set for the sum
    const updateAllDataSets = () => {
      for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {
        updateOneHarmonic( fourierSeries.harmonics[ i ], harmonicPlots[ i ] );
      }
      updateSum();
    };

    // Create a plot for each harmonic, in harmonic order.
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // Plot for this harmonic.
      const harmonicPlot = new LinePlot( this.chartModel, [], {
        stroke: harmonic.colorProperty
      } );
      harmonicPlots.push( harmonicPlot );

      // unlink is not needed.
      harmonic.amplitudeProperty.link( () => {
        updateOneHarmonic( harmonic, harmonicPlot );
        updateSum();
      } );
    }

    // unmultilink is not needed.
    Property.multilink( [ fourierSeries.numberOfHarmonicsProperty, domainProperty, waveTypeProperty ], updateAllDataSets );

    // removeListener is not needed.
    this.chartModel.transformChangedEmitter.addListener( updateAllDataSets );

    // Plots are clipped to chartRectangle.
    this.addChild( new Node( {
      children: harmonicPlots.slice().reverse(), // in reverse order, so that fundamental is on top
      clipArea: this.chartRectangle.getShape()
    } ) );
  }

  /**
   * Steps the chart.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO support for Domain.SPACE_AND_TIME
  }
}

/**
 * Creates the data set for a harmonic. This algorithm uses the equations that correspond to MathForm.MODE.
 * @param {number} order
 * @param {number} amplitude
 * @param {Range} xRange
 * @param {Domain} domain
 * @param {WaveType} waveType
 * @returns {Vector2[]}
 */
function createHarmonicDataSet( order, amplitude, xRange, domain, waveType ) {

  assert && AssertUtils.assertPositiveInteger( order );
  assert && assert( typeof amplitude === 'number', 'invalid amplitude' );
  assert && assert( xRange instanceof Range, 'invalid xRange' );
  assert && assert( Domain.includes( domain ), 'invalid domain' );
  assert && assert( WaveType.includes( waveType ), 'invalid waveType' );

  const dx = xRange.getLength() / POINTS_PER_PLOT;

  const dataSet = [];
  for ( let x = xRange.min; x <= xRange.max; x += dx ) {
    let y;
    if ( domain === Domain.SPACE ) {
      if ( waveType === WaveType.SINE ) {
        y = amplitude * Math.sin( 2 * Math.PI * order * x / FWMConstants.L );
      }
      else {
        y = amplitude * Math.cos( 2 * Math.PI * order * x / FWMConstants.L );
      }
    }
    else if ( domain === Domain.TIME ) {
      if ( waveType === WaveType.SINE ) {
        y = amplitude * Math.sin( 2 * Math.PI * order * x / FWMConstants.T );
      }
      else {
        y = amplitude * Math.cos( 2 * Math.PI * order * x / FWMConstants.T );
      }
    }
    else {
      //TODO support for Domain.SPACE_AND_TIME
      y = 0;
    }
    dataSet.push( new Vector2( x, y ) );
  }
  return dataSet;
}

/**
 * Creates the data set for the sum of harmonics. This algorithm uses the equations that correspond to MathForm.MODE.
 * @param {LinePlot[]} harmonicPlots
 * @returns {Vector2[]}
 */
function createSumDataSet( harmonicPlots ) {

  assert && AssertUtils.assertArrayOf( harmonicPlots, LinePlot );
  assert && assert( harmonicPlots.length > 0, 'requires at least 1 plot' );

  const numberOfPoints = harmonicPlots[ 0 ].dataSet.length;
  assert( _.every( harmonicPlots, plot => plot.dataSet.length === numberOfPoints ),
    'all data sets must have the same number of points' );

  // Sum the corresponding y values of all data sets.
  const sumDataSet = [];
  for ( let pointIndex = 0; pointIndex < numberOfPoints; pointIndex++ ) {
    let ySum = 0;
    const x0 = harmonicPlots[ 0 ].dataSet[ pointIndex ].x;
    for ( let plotIndex = 0; plotIndex < harmonicPlots.length; plotIndex++ ) {
      const point = harmonicPlots[ plotIndex ].dataSet[ pointIndex ];
      assert && assert( point.x === x0, `all data sets should have the same dx, ${point.x} !== ${x0}` );
      ySum += point.y;
    }
    sumDataSet.push( new Vector2( x0, ySum ) );
  }
  return sumDataSet;
}

fourierMakingWaves.register( 'HarmonicsChart', HarmonicsChart );
export default HarmonicsChart;
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

    // Create a LinePlot for each harmonic, in reverse order so that the fundamental is on top.
    const linePlots = [];
    for ( let order = fourierSeries.harmonics.length; order >= 1; order-- ) {

      const harmonic = fourierSeries.harmonics[ order - 1 ];

      const linePlot = new LinePlot( this.chartModel, [], {
        stroke: harmonic.colorProperty
      } );
      linePlots.push( linePlot );

      //TODO move this to model, add dataSetProperty for each Harmonic, reuse the dataSet for each Harmonic to compute the sum.
      const updateDataSet = () => {
        const amplitude = harmonic.amplitudeProperty.value;

        //TODO do we want to show 0 amplitudes? Java version does not.
        if ( harmonic.order <= fourierSeries.numberOfHarmonicsProperty.value && amplitude !== 0 ) {
          linePlot.setDataSet( createDataSet( harmonic.order, amplitude, this.chartModel.modelXRange, domainProperty.value, waveTypeProperty.value ) );
        }
        else {
          linePlot.setDataSet( [] );
        }
      };

      // removeListener is not needed.
      this.chartModel.transformChangedEmitter.addListener( updateDataSet );

      // unmultilink is not needed.
      Property.multilink(
        [ fourierSeries.numberOfHarmonicsProperty, harmonic.amplitudeProperty, domainProperty, waveTypeProperty ],
        updateDataSet );
    }

    // Plots are clipped to chartRectangle.
    this.addChild( new Node( {
      children: linePlots,
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
 * Creates a data set used to create a LinePlot for a harmonic.
 * This algorithm uses the equations that correspond to MathForm.MODE.
 * @param {number} order
 * @param {number} amplitude
 * @param {Range} range
 * @param {Domain} domain
 * @param {WaveType} waveType
 * @returns {Vector2[]}
 */
function createDataSet( order, amplitude, range, domain, waveType ) {

  assert && AssertUtils.assertPositiveInteger( order );
  assert && assert( typeof amplitude === 'number', 'invalid amplitude' );
  assert && assert( range instanceof Range, 'invalid range' );
  assert && assert( Domain.includes( domain ), 'invalid domain' );
  assert && assert( WaveType.includes( waveType ), 'invalid waveType' );

  const dx = range.getLength() / POINTS_PER_PLOT;

  const dataSet = [];
  for ( let x = range.min; x <= range.max; x += dx ) {
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

fourierMakingWaves.register( 'HarmonicsChart', HarmonicsChart );
export default HarmonicsChart;
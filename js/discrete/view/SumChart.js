// Copyright 2020, University of Colorado Boulder

/**
 * SumChart is the 'Sum' chart in the 'Discrete' screen. It renders 1 plot showing the sum of the harmonics in
 * the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import Waveform from '../model/Waveform.js';
import SeriesType from '../model/SeriesType.js';
import AxisDescription from '../model/AxisDescription.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import DiscreteChart from './DiscreteChart.js';
import ExpandedFormButton from './ExpandedFormButton.js';
import ExpandedFormDialog from './ExpandedFormDialog.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';
import SumEquationNode from './SumEquationNode.js';

class SumChart extends DiscreteChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<Vector2[]>} sumDataSetProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {NumberProperty} yZoomLevelProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Property.<boolean>} autoScaleProperty
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, sumDataSetProperty, waveformProperty, domainProperty, seriesTypeProperty, equationFormProperty,
               xZoomLevelProperty, xAxisDescriptionProperty,
               yZoomLevelProperty, yAxisDescriptionProperty,
               autoScaleProperty, infiniteHarmonicsVisibleProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertPropertyOf( sumDataSetProperty, Array );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );
    assert && assert( xZoomLevelProperty instanceof NumberProperty, 'invalid xZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && assert( yZoomLevelProperty instanceof NumberProperty, 'invalid yZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPropertyOf( autoScaleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( infiniteHarmonicsVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( fourierSeries, domainProperty, equationFormProperty, xZoomLevelProperty, xAxisDescriptionProperty, options );

    const equationNode = new SumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty,
      seriesTypeProperty, equationFormProperty, {
        maxWidth: 0.5 * this.chartRectangle.width,
        tandem: options.tandem.createTandem( 'equationNode' ),
        phetioReadOnly: true
      } );
    this.addChild( equationNode );

    // Button that opens the 'Expanded Sum' dialog
    const expandedFormButton = new ExpandedFormButton( {
      scale: 0.45,
      listener: () => {
        const dialog = new ExpandedFormDialog( fourierSeries, domainProperty, seriesTypeProperty, equationFormProperty, {
          hideCallback: () => dialog.dispose()
        } );
        dialog.show();
      },
      tandem: options.tandem.createTandem( 'expandedFormButton' ),
      phetioReadOnly: true
    } );
    this.addChild( expandedFormButton );

    //TODO this is not working as expected with stringTest=long
    equationNode.localBoundsProperty.link( () => {

      // Ensure that expandedFormButton is always above the chart, regardless of how tall the equation is.
      const maxHeight = Math.max( equationNode.height, expandedFormButton.height );

      // Center the equation above the chart
      equationNode.centerX = this.chartRectangle.centerX;
      equationNode.centerY = this.chartRectangle.top - ( maxHeight / 2 ) - 5;

      // Button to the right of the equation
      expandedFormButton.left = equationNode.right + 20;
      expandedFormButton.centerY = equationNode.centerY;
    } );

    // expandedFormButton is visible only when the equation is visible.
    equationNode.visibleProperty.link( visible => {
      expandedFormButton.interruptSubtreeInput();
      expandedFormButton.visible = visible;
    } );

    // Zoom buttons for the y-axis range
    const yZoomButtonGroup = new PlusMinusZoomButtonGroup( yZoomLevelProperty, {
      orientation: 'vertical',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      left: this.yAxisLabel.left,
      top: this.chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'yZoomButtonGroup' )
    } );
    this.addChild( yZoomButtonGroup );

    // unlink is not needed.
    yAxisDescriptionProperty.link( yAxisDescription => {
      this.chartTransform.setModelYRange( new Range( -yAxisDescription.max, yAxisDescription.max ) );
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    // Shows the wave that the Fourier series is attempting to approximate
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty, {
      listener: () => {
        //TODO
      },
      tandem: options.tandem.createTandem( 'infiniteHarmonicsCheckbox' )
    } );

    // Disable infiniteHarmonicsCheckbox for custom waveform. unlink is not needed.
    waveformProperty.link( waveform => {
      infiniteHarmonicsCheckbox.enabled = ( waveform !== Waveform.CUSTOM );
    } );

    // Automatically scales the y axis to show the entire plot
    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty, {
      listener: () => {
        //TODO
      },
      tandem: options.tandem.createTandem( 'autoScaleCheckbox' )
    } );

    const checkboxesParent = new HBox( {
      spacing: 25,
      children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ],
      left: this.chartRectangle.left,
      top: this.xTickLabels.bottom + 5
    } );
    this.addChild( checkboxesParent );

    // Plot that shows the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, sumDataSetProperty.value, {
      stroke: 'black'
    } );

    // Draw the sum plot using Canvas, clipped to chartRectangle.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ], {
      clipArea: this.chartRectangle.getShape()
    } );
    this.addChild( chartCanvasNode );

    // unlink is not needed.
    sumDataSetProperty.link( dataSet => {
      sumPlot.setDataSet( dataSet );
      chartCanvasNode.update();
    } );
  }
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;
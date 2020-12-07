// Copyright 2020, University of Colorado Boulder

/**
 * SumChart is the 'Sum' chart in the 'Discrete' screen. It renders 1 plot showing the sum of the harmonics in
 * the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import ZoomButtonGroup from '../../../../scenery-phet/js/ZoomButtonGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import WaveType from '../model/WaveType.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import DiscreteChart from './DiscreteChart.js';
import ExpandedFormButton from './ExpandedFormButton.js';
import ExpandedFormDialog from './ExpandedFormDialog.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';
import SumEquationNode from './SumEquationNode.js';

class SumChart extends DiscreteChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {NumberProperty} yZoomLevelProperty
   * @param {Property.<boolean>} autoScaleProperty
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, waveTypeProperty, mathFormProperty,
               xZoomLevelProperty, yZoomLevelProperty,
               autoScaleProperty, infiniteHarmonicsVisibleProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( xZoomLevelProperty instanceof NumberProperty, 'invalid xZoomLevelProperty' );
    assert && assert( yZoomLevelProperty instanceof NumberProperty, 'invalid yZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( autoScaleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( infiniteHarmonicsVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( fourierSeries, domainProperty, options );

    const equationNode = new SumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty,
      waveTypeProperty, mathFormProperty, {
        maxWidth: 0.5 * this.chartRectangle.width
      } );
    this.addChild( equationNode );

    // Button that opens the 'Expanded Sum' dialog
    const expandedFormButton = new ExpandedFormButton( {
      scale: 0.45,
      listener: () => {
        const dialog = new ExpandedFormDialog( fourierSeries, domainProperty, waveTypeProperty, mathFormProperty, {
          hideCallback: () => dialog.dispose()
        } );
        dialog.show();
      }
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

    // expandedFormButton is visible only when a math form is selected.
    mathFormProperty.link( mathForm => {
      expandedFormButton.interruptSubtreeInput();
      expandedFormButton.visible = ( mathForm !== MathForm.HIDDEN );
    } );

    // Zoom buttons for the x-axis range
    const xZoomButtonGroup = new ZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      left: this.chartRectangle.right + 5,
      bottom: this.chartRectangle.bottom
    } );
    this.addChild( xZoomButtonGroup );

    // Zoom buttons for the y-axis range
    const yZoomButtonGroup = new ZoomButtonGroup( yZoomLevelProperty, {
      orientation: 'vertical',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      left: this.chartRectangle.right + 5,
      top: this.chartRectangle.top
    } );
    this.addChild( yZoomButtonGroup );

    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty );
    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty );
    const checkboxesParent = new HBox( {
      spacing: 25,
      children: [ infiniteHarmonicsCheckbox, autoScaleCheckbox ],
      right: this.chartRectangle.right,
      top: this.xLabelSet.bottom + 5
    } );
    this.addChild( checkboxesParent );
  }
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;
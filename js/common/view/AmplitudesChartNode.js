// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudesChartNode is the base class for displaying and controlling the amplitudes for harmonics in a Fourier series.
 * The x axis is harmonic order (1-N), the y axis is amplitude.
 *
 * Amplitudes are displayed as a bar chart, where each bar is a slider. Amplitude can be adjusted using the slider,
 * or by using a Keypad that opens when a NumberDisplay is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import FourierSeries from '../model/FourierSeries.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';
import AmplitudeNumberDisplay from './AmplitudeNumberDisplay.js';
import AmplitudeSlider from './AmplitudeSlider.js';

// constants
const X_MARGIN = 0.5; // x-axis margins, in model coordinates
const Y_TICK_SPACING = 0.5; // spacing of y-axis tick marks, in model coordinates
const Y_TICK_LABEL_DECIMAL_PLACES = 1;

class AmplitudesChartNode extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, amplitudeKeypadDialog, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics, 'invalid emphasizedHarmonics' );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog, 'invalid amplitudeKeypadDialog' );

    options = merge( {

      // {function} called when the user starts editing any amplitude value
      onEdit: _.noop,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // the transform from model to view coordinates
    const chartTransform = new ChartTransform( {
      viewWidth: options.viewWidth,
      viewHeight: options.viewHeight,
      modelXRange: new Range( 1 - X_MARGIN, fourierSeries.harmonics.length + X_MARGIN ),
      modelYRange: fourierSeries.amplitudeRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform );

    // x axis ---------------------------------------------------------

    const xAxisLabel = new RichText( FMWSymbols.n, {
      font: FMWConstants.AXIS_LABEL_FONT,
      left: chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 30, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // Create a slider for each harmonic's amplitude
    const sliders = _.map( fourierSeries.harmonics, harmonic =>
      new AmplitudeSlider( harmonic, emphasizedHarmonics, {
        press: options.onEdit,
        trackHeight: options.viewHeight,
        center: chartTransform.modelToViewXY( harmonic.order, 0 ),
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}Slider` )
      } )
    );

    // Create a number display for each harmonic's amplitude
    const numberDisplays = _.map( fourierSeries.harmonics, harmonic =>
      new AmplitudeNumberDisplay( harmonic, emphasizedHarmonics, amplitudeKeypadDialog, {
        press: options.onEdit,
        centerX: chartTransform.modelToViewX( harmonic.order ),
        bottom: chartRectangle.top - 10,
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}NumberDisplay` )
      } )
    );

    // y axis ---------------------------------------------------------

    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: -FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    const yGridLineSet = new GridLineSet( chartTransform, Orientation.VERTICAL, Y_TICK_SPACING, {
      stroke: FMWColorProfile.amplitudeGridLinesStrokeProperty,
      lineWidth: 0.5
    } );

    const yLabelSet = new LabelSet( chartTransform, Orientation.VERTICAL, Y_TICK_SPACING, {
      edge: 'min',
      // Create tick labels with trailing zeros removed from decimal places.
      createLabel: value => new Text( Utils.toFixedNumber( value, Y_TICK_LABEL_DECIMAL_PLACES ), { fontSize: 12 } )
    } );

    // ---------------------------------------------------------------

    assert && assert( !options.children, 'AmplitudesChartNode sets children' );
    options.children = [
      chartRectangle,
      xAxisLabel,
      yAxisLabel, yGridLineSet, yLabelSet,
      ...sliders,
      ...numberDisplays
    ];

    super( options );

    // @protected
    this.sliders = sliders;
    this.numberDisplays = numberDisplays;

    // @public
    this.chartTransform = chartTransform;
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'AmplitudesChartNode', AmplitudesChartNode );
export default AmplitudesChartNode;
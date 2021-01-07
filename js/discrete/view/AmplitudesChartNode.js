// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudesChartNode displays and controls the amplitudes for harmonics in a Fourier series. Amplitudes are displayed
 * as a bar chart, where each bar is a slider. Amplitude can be adjusted using the slider, or by using a Keypad that
 * opens when a NumberDisplay is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import AmplitudeNumberDisplay from '../../common/view/AmplitudeNumberDisplay.js';
import AmplitudeSlider from '../../common/view/AmplitudeSlider.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Waveform from '../model/Waveform.js';

class AmplitudesChartNode extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {ObservableArrayDef} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( fourierSeries, amplitudeKeypadDialog, waveformProperty, emphasizedHarmonics, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog, 'invalid amplitudeKeypadDialog' );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );

    options = merge( {

      // {number} dimensions of the chart rectangle, in view coordinates
      viewWidth: 100,
      viewHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // the transform between model and view coordinate frames
    const chartTransform = new ChartTransform( {
      viewWidth: options.viewWidth,
      viewHeight: options.viewHeight,
      modelXRange: new Range( fourierSeries.numberOfHarmonicsProperty.range.min - 0.5, fourierSeries.numberOfHarmonicsProperty.range.max + 0.5 ),
      modelYRange: fourierSeries.amplitudeRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform );

    const yGridLineSet = new GridLineSet( chartTransform, Orientation.VERTICAL, 0.5, {
      stroke: FMWColorProfile.amplitudeGridLinesStrokeProperty,
      lineWidth: 0.5
    } );

    const yLabelSet = new LabelSet( chartTransform, Orientation.VERTICAL, 0.5, {
      edge: 'min',
      createLabel: value => new Text( Utils.toFixedNumber( value, 1 ), { fontSize: 12 } )
    } );

    const xAxisLabel = new RichText( FMWSymbols.n, {
      font: FMWConstants.AXIS_LABEL_FONT,
      left: chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 30, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: -FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    // Create a slider for each harmonic's amplitude
    const sliders = _.map( fourierSeries.harmonics, harmonic =>
      new AmplitudeSlider( harmonic, waveformProperty, emphasizedHarmonics, {
        trackHeight: options.viewHeight,
        center: chartTransform.modelToViewPosition( new Vector2( harmonic.order, 0 ) ),
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}Slider` )
      } )
    );

    // Create a number display for each harmonic's amplitude
    const numberDisplays = _.map( fourierSeries.harmonics, harmonic =>
      new AmplitudeNumberDisplay( harmonic, amplitudeKeypadDialog, waveformProperty, {
        centerX: chartTransform.modelToViewX( harmonic.order ),
        bottom: chartRectangle.top - 10,
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}NumberDisplay` )
      } )
    );

    assert && assert( !options.children, 'AmplitudesChartNode sets children' );
    options.children = [
      chartRectangle,
      xAxisLabel,
      yAxisLabel, yGridLineSet, yLabelSet,
      ...sliders,
      ...numberDisplays
    ];

    super( options );

    // Hide sliders and number displays that are not part of the series
    fourierSeries.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      assert && assert( numberOfHarmonics > 0 && numberOfHarmonics <= sliders.length,
        `unsupported numberOfHarmonics: ${numberOfHarmonics}` );

      for ( let i = 0; i < sliders.length; i++ ) {
        const visible = ( i < numberOfHarmonics );
        sliders[ i ].visible = visible;
        numberDisplays[ i ].visible = visible;
      }
    } );
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
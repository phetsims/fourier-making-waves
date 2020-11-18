// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudesChart displays and controls the amplitudes for harmonics in a Fourier series. Amplitudes are displayed
 * as a bar chart, where each bar is a slider. Amplitude can be adjusted using the slider, or by using a Keypad that
 * opens when a NumberDisplay is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import ChartModel from '../../../../griddle/js/bamboo/ChartModel.js';
import ChartRectangle from '../../../../griddle/js/bamboo/ChartRectangle.js';
import GridLineSet from '../../../../griddle/js/bamboo/GridLineSet.js';
import LabelSet from '../../../../griddle/js/bamboo/LabelSet.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import AmplitudeNumberDisplay from '../../common/view/AmplitudeNumberDisplay.js';
import AmplitudeSlider from '../../common/view/AmplitudeSlider.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

//TODO set dimensions based on available space
const CHART_VIEW_WIDTH = 650;
const CHART_VIEW_HEIGHT = 120;

class AmplitudesChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog
   * @param {Object} [options]
   */
  constructor( fourierSeries, amplitudeKeypadDialog, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog, 'invalid amplitudeKeypadDialog' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const chartModel = new ChartModel( CHART_VIEW_WIDTH, CHART_VIEW_HEIGHT, {
      modelXRange: fourierSeries.numberOfHarmonicsProperty.range,
      modelYRange: fourierSeries.amplitudeRange
    } );

    const chartRectangle = new ChartRectangle( chartModel );

    const yGridLineSet = new GridLineSet( chartModel, Orientation.VERTICAL, 0.5, {
      stroke: new Color( 0, 0, 0, 0.3 )
    } );

    const yLabelSet = new LabelSet( chartModel, Orientation.VERTICAL, 0.5, {
      edge: 'min',
      createLabel: value => new Text( Utils.toFixedNumber( value, 1 ), { fontSize: 12 } )
    } );

    const xAxisLabel = new Text( FMWSymbols.SMALL_N, {
      font: FMWConstants.AXIS_LABEL_FONT,
      left: chartRectangle.right + 10,
      centerY: chartRectangle.centerY
    } );

    const yAxisLabel = new RichText( StringUtils.fillIn( fourierMakingWavesStrings.amplitudeSymbol, {
      symbol: FMWSymbols.CAPITAL_A
    } ), {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: yLabelSet.left - 10,
      centerY: chartRectangle.centerY
    } );

    // To make sliders and number displays have the same effective width
    const alignBoxOptions = {
      group: new AlignGroup( {
        matchHorizontal: true,
        matchVertical: false
      } )
    };

    // Create a slider for each harmonic's amplitude
    const sliders = _.map( fourierSeries.harmonics, harmonic =>
      new AlignBox( new AmplitudeSlider( harmonic.amplitudeProperty, harmonic.colorProperty, {
        trackHeight: CHART_VIEW_HEIGHT,
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}Slider` ),
        phetioReadOnly: true
      } ), alignBoxOptions )
    );

    // Create a number display for each harmonic's amplitude
    const numberDisplays = _.map( fourierSeries.harmonics, harmonic =>
      new AlignBox( new AmplitudeNumberDisplay( harmonic, amplitudeKeypadDialog, {
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}NumberDisplay` ),
        phetioReadOnly: true
      } ), alignBoxOptions )
    );

    // Compute the horizontal spacing, knowing that the sliders and numberDisplays all have the same effective width.
    const numberOfComponents = fourierSeries.harmonics.length;
    const componentWidth = sliders[ 0 ].width;
    const margin = 10;
    const spacing = ( chartRectangle.width - numberOfComponents * componentWidth - 2 * margin ) / ( numberOfComponents - 1 );
    assert && assert( spacing > 0, `invalid spacing: ${spacing}` );

    // Lay out the sliders
    const slidersLayoutBox = new HBox( {
      excludeInvisibleChildrenFromBounds: false,
      children: sliders,
      spacing: spacing,
      center: chartRectangle.center
    } );

    // Lay out the NumberDisplays
    const numberDisplaysLayoutBox = new HBox( {
      excludeInvisibleChildrenFromBounds: false,
      children: numberDisplays,
      spacing: spacing,
      centerX: chartRectangle.centerX,
      bottom: chartRectangle.top - 10
    } );

    assert && assert( !options.children, 'AmplitudesChart sets children' );
    options.children = [ numberDisplaysLayoutBox, new Node( {
      children: [ chartRectangle, yGridLineSet, yLabelSet, xAxisLabel, yAxisLabel, slidersLayoutBox, numberDisplaysLayoutBox ]
    } ) ];

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

fourierMakingWaves.register( 'AmplitudesChart', AmplitudesChart );
export default AmplitudesChart;
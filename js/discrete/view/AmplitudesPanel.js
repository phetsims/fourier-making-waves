// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudesPanel is the 'Amplitudes' panel in the 'Discrete' screen.
 * This is where the user can adjust the amplitudes of each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import XYChartNode from '../../../../griddle/js/XYChartNode.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import AmplitudeNumberDisplay from '../../common/view/AmplitudeNumberDisplay.js';
import AmplitudeSlider from '../../common/view/AmplitudeSlider.js';
import FourierMakingWavesPanel from '../../common/view/FourierMakingWavesPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants

// Font size for the numeric tick marks (on the left) and the "n" label on the right
const LABEL_FONT_SIZE = 12;

class AmplitudesPanel extends FourierMakingWavesPanel {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Object} [options]
   */
  constructor( fourierSeries, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );

    options = merge( {}, FourierMakingWavesConstants.PANEL_OPTIONS, {
      align: 'left',
      fixedWidth: 100,
      fixedHeight: 100,
      fill: 'transparent',
      stroke: null,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // The XYChartNode is just used to render the chart area, not for rendering any data sets.  The AmplitudeSlider
    // instances will be added to it as children.
    //TODO replace XYChartNode with bamboo components
    const xyChartNode = new XYChartNode( {

      // Dimensions
      width: 610,
      height: 120,

      cornerRadius: 0,

      // Use the same range as the amplitudes.
      defaultModelYRange: fourierSeries.amplitudeRange,

      // Border for the chart.
      chartPanelOptions: {
        lineWidth: 2,
        stroke: null,
        fill: null
      },

      showHorizontalGridLabels: false,
      verticalGridLabelNumberOfDecimalPlaces: 1,
      majorHorizontalLineSpacing: 0.5,
      gridNodeOptions: {

        // Don't show vertical lines within the chart
        majorVerticalLineSpacing: null,
        majorLineOptions: {
          stroke: new Color( 0, 0, 0, 0.3 )
        }
      },
      gridLabelOptions: {
        fontSize: LABEL_FONT_SIZE
      }
    } );

    const xAxisLabel = new Text( fourierMakingWavesStrings.n, {
      font: FourierMakingWavesConstants.AXIS_FONT,
      left: xyChartNode.right + 10,
      centerY: xyChartNode.chartPanel.centerY
    } );

    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitudeA, {
      font: FourierMakingWavesConstants.AXIS_FONT,
      rotation: -Math.PI / 2,
      right: xyChartNode.left - 10,
      centerY: xyChartNode.chartPanel.centerY
    } );

    // Compute the track height based on the dimensions in the chart, so it will match up
    const trackHeight = Math.abs( xyChartNode.modelViewTransformProperty.value.modelToViewDeltaY( fourierSeries.amplitudeRange.getLength() ) );

    // Create a slider for each harmonic's amplitude
    const sliders = _.map( fourierSeries.harmonics, harmonic =>
      new AmplitudeSlider( harmonic.amplitudeProperty, harmonic.colorProperty, {
        trackHeight: trackHeight,
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}Slider` ),
        phetioReadOnly: true
      } )
    );

    // Lay out the sliders
    const margin = 10;
    const slidersLayoutBox = new HBox( {
      spacing: ( xyChartNode.chartPanel.width - sliders.length * sliders[ 0 ].width - 2 * margin ) / ( sliders.length - 1 ),
      children: sliders,
      center: xyChartNode.chartPanel.center
    } );

    // Put the sliders in the xyChartNode instead of the xyChartNode.chartPanel so they won't be clipped
    xyChartNode.addChild( slidersLayoutBox );

    // Create a number display for each harmonic's amplitude
    const numberDisplays = _.map( fourierSeries.harmonics, harmonic =>
      new AmplitudeNumberDisplay( harmonic, {
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}NumberDisplay` ),
        phetioReadOnly: true
      } )
    );

    // Layout of the number displays
    const numberDisplaysLayoutBox = new HBox( {
      children: numberDisplays,

      //TODO center a AmplitudeNumberDisplay above each AmplitudeSlider
      spacing: 5
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 5,
      children: [ numberDisplaysLayoutBox, new Node( {
        children: [ yAxisLabel, xyChartNode, xAxisLabel ]
      } ) ]
    } );

    super( content, options );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'AmplitudesPanel', AmplitudesPanel );
export default AmplitudesPanel;
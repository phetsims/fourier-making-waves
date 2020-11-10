// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteAmplitudePanel is the 'Amplitude' panel in the 'Discrete' screen.
 * This is where the user can adjust the amplitudes of each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import XYChartNode from '../../../../griddle/js/XYChartNode.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FourierMakingWavesColors from '../../common/FourierMakingWavesColors.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import AmplitudeSlider from '../../common/view/AmplitudeSlider.js';
import FourierMakingWavesPanel from '../../common/view/FourierMakingWavesPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants

// Font size for the numeric tick marks (on the left) and the "n" label on the right
const LABEL_FONT_SIZE = 15;

class DiscreteAmplitudesPanel extends FourierMakingWavesPanel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, FourierMakingWavesConstants.PANEL_OPTIONS, {
      align: 'left',
      fixedWidth: 100,
      fixedHeight: 100
    }, options );

    const titleNode = new Text( fourierMakingWavesStrings.amplitudes, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const amplitudeRange = new Range( -1.27, 1.27 );

    // The XYChartNode is just used to render the chart area, not for rendering any data sets.  The AmplitudeSlider
    // instances will be added to it as children.
    const xyChartNode = new XYChartNode( {

      // Dimensions
      width: 610,
      height: 120,

      cornerRadius: 0,

      // Use the same range as the sliders.  Note the chart extends beyond -1..1, like a margin.
      defaultModelYRange: amplitudeRange,

      // Border for the chart.
      chartPanelOptions: {
        lineWidth: 2
      },

      showHorizontalGridLabels: false,
      verticalGridLabelNumberOfDecimalPlaces: 1,
      majorHorizontalLineSpacing: 0.5,
      gridNodeOptions: {

        // Don't show vertical lines within the chart
        majorVerticalLineSpacing: null
      },
      gridLabelOptions: {
        fontSize: LABEL_FONT_SIZE
      }
    } );

    // Compute the track height based on the dimensions in the chart, so it will match up
    const trackHeight = Math.abs( xyChartNode.modelViewTransformProperty.value.modelToViewDeltaY( amplitudeRange.getLength() ) );

    //TODO a test of AmplitudeSlider
    const sliders = _.map( FourierMakingWavesColors.HARMONIC_COLORS, color =>
      new AmplitudeSlider( new NumberProperty( 0, { range: amplitudeRange } ), {
        color: color,
        trackHeight: trackHeight
      } )
    );

    // Solve for spacing between sliders
    // n * sliderWidth + (n-1) * spacing +margin*2 = totalWidth
    // n * sliderWidth + n*spacing - spacing + margin * 2 = totalWidth
    // spacing ( n - 1) + n*sliderWidth + margin*2 = totalWidth
    const margin = 10;
    const spacing = ( xyChartNode.chartPanel.width - sliders.length * sliders[ 0 ].width - margin * 2 ) / ( sliders.length - 1 );
    const slidersLayoutBox = new HBox( {
      spacing: spacing,
      children: sliders,
      x: margin,
      centerY: xyChartNode.chartHeight / 2
    } );

    // Put the sliders in the xyChartNode instead of the xyChartNode.chartPanel so they won't be clipped
    xyChartNode.addChild( slidersLayoutBox );

    const content = new VBox( {
      align: 'left',
      spacing: 5,
      children: [ titleNode, new HBox( {
        spacing: 5,
        children: [ new HStrut( 75 ), xyChartNode, new Text( fourierMakingWavesStrings.n, {
          fontSize: 14
        } ) ]
      } ) ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesPanel', DiscreteAmplitudesPanel );
export default DiscreteAmplitudesPanel;
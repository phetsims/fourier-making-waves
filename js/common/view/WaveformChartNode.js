// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveformChartNode is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import WaveformChart from '../model/WaveformChart.js';
import FMWChartNode from './FMWChartNode.js';
import TickLabelUtils from './TickLabelUtils.js';

// constants
const X_TICK_LABEL_DECIMALS = 2;
const Y_TICK_LABEL_DECIMALS = 1;
const X_SPACE_LABEL = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
  symbol: FMWSymbols.x,
  units: fourierMakingWavesStrings.units.meters
} );
const X_TIME_LABEL = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
  symbol: FMWSymbols.t,
  units: fourierMakingWavesStrings.units.milliseconds
} );

class WaveformChartNode extends FMWChartNode {

  //TODO
  /**
   * @param {WaveformChart} waveformChart
   * @param {Object} [options]
   */
  constructor( waveformChart, options ) {

    assert && assert( waveformChart instanceof WaveformChart );

    // Fields of interest in waveformChart, to improve readability
    const L = waveformChart.L;
    const T = waveformChart.T;
    const domainProperty = waveformChart.domainProperty;
    const xAxisTickLabelFormatProperty = waveformChart.xAxisTickLabelFormatProperty;
    const xAxisDescriptionProperty = waveformChart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = waveformChart.yAxisDescriptionProperty;
    const yAutoScaleProperty = waveformChart.yAutoScaleProperty;
    const yAxisAutoScaleRangeProperty = waveformChart.yAxisAutoScaleRangeProperty;
    assert && assert( ( !yAutoScaleProperty && !yAxisAutoScaleRangeProperty ) ||
                      ( yAutoScaleProperty && yAxisAutoScaleRangeProperty ),
      'yAutoScaleProperty and yAxisAutoScaleRangeProperty are both or neither' );

    options = merge( {

      chartTransformOptions: {
        modelXRange: xAxisDescriptionProperty.value.createAxisRange( domainProperty.value, L, T ),
        modelYRange: yAxisDescriptionProperty.value.range
      },

      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS,
          xAxisTickLabelFormatProperty.value, domainProperty.value, L, T )
      },

      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // x-axis tick labels are specific to domain and format (numeric vs symbolic)
    Property.multilink( [ domainProperty, xAxisTickLabelFormatProperty ], () => this.xTickLabels.invalidateLabelSet() );

    // Update the x axis.
    Property.multilink(
      [ xAxisDescriptionProperty, domainProperty ],
      ( xAxisDescription, domain ) => {
        const value = ( domain === Domain.TIME ) ? T : L;
        const xMin = value * xAxisDescription.range.min;
        const xMax = value * xAxisDescription.range.max;
        this.chartTransform.setModelXRange( new Range( xMin, xMax ) );
        this.xGridLines.setSpacing( xAxisDescription.gridLineSpacing * value );
        this.xTickMarks.setSpacing( xAxisDescription.tickMarkSpacing * value );
        this.xTickLabels.setSpacing( xAxisDescription.tickLabelSpacing * value );
        this.xTickLabels.invalidateLabelSet();
      } );

    // Update the y-axis.
    yAxisDescriptionProperty.link( yAxisDescription => {

      // Range is determined by yAxisDescription only if auto scale is disabled.
      if ( !yAutoScaleProperty || !yAutoScaleProperty.value ) {
        this.chartTransform.setModelYRange( yAxisDescription.range );
      }

      // Grid lines and tick marks are determined by AxisDescriptions regardless of whether auto scale is enabled.
      // This is because the model keeps AxisDescriptions in sync with yAxisAutoScaleRange.
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    // Set the x-axis label based on domain.
    domainProperty.link( domain => {
      this.xAxisLabel.text = ( domain === Domain.TIME ) ? X_TIME_LABEL : X_SPACE_LABEL;
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WaveformChartNode', WaveformChartNode );
export default WaveformChartNode;
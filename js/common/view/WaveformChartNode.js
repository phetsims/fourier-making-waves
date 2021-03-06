// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveformChartNode is the base class for charts that supports multiple domains and multiple formats for its
 * labels and values.  Labels can be in space or time domains. Values can numeric (as plain old numbers) or
 * symbolic (as coefficients with symbols).
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

  /**
   * @param {WaveformChart} chart
   * @param {Object} [options]
   */
  constructor( chart, options ) {

    assert && assert( chart instanceof WaveformChart );

    // Fields of interest in chart, to improve readability
    const L = chart.L;
    const T = chart.T;
    const domainProperty = chart.domainProperty;
    const xAxisTickLabelFormatProperty = chart.xAxisTickLabelFormatProperty;
    const xAxisDescriptionProperty = chart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = chart.yAxisDescriptionProperty;
    const yAutoScaleProperty = chart.yAutoScaleProperty;
    const yAxisAutoScaleRangeProperty = chart.yAxisAutoScaleRangeProperty;
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
// Copyright 2020-2021, University of Colorado Boulder

/**
 * DomainChartNode is the base class for charts that need to modify their presentation to match a domain -
 * space, time, or space-&-time.  This affects the axis labels, tick labels, spacing of grid lines and tick marks, etc.
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
import DomainChart from '../model/DomainChart.js';
import FMWChartNode from './FMWChartNode.js';

// constants
const X_SPACE_LABEL = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
  symbol: FMWSymbols.x,
  units: fourierMakingWavesStrings.units.meters
} );
const X_TIME_LABEL = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
  symbol: FMWSymbols.t,
  units: fourierMakingWavesStrings.units.milliseconds
} );

class DomainChartNode extends FMWChartNode {

  /**
   * @param {DomainChart} chart
   * @param {Object} [options]
   */
  constructor( chart, options ) {

    assert && assert( chart instanceof DomainChart );

    // Fields of interest in chart, to improve readability
    const domainProperty = chart.domainProperty;
    const xAxisDescriptionProperty = chart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = chart.yAxisDescriptionProperty;
    const L = chart.L;
    const T = chart.T;

    options = merge( {

      chartTransformOptions: {
        modelXRange: xAxisDescriptionProperty.value.createRangeForDomain( domainProperty.value, L, T ),
        modelYRange: yAxisDescriptionProperty.value.range
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

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
      // NOTE: this.chartTransform.setModelYRange is handled via yAxisRangeProperty. TODO is this accurate?
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

fourierMakingWaves.register( 'DomainChartNode', DomainChartNode );
export default DomainChartNode;
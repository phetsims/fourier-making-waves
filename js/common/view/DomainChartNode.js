// Copyright 2020-2021, University of Colorado Boulder

/**
 * DomainChartNode is the base class for charts that need to modify their x axis to match a specific Domain.
 * This class is responsible for the chart's x-axis range and decorations (grid lines, tick marks, labels).
 * This serves as the base class for the bottom 2 charts (Harmonics/Components and Sum) in all screens.
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
    const L = chart.L;
    const T = chart.T;

    options = merge( {

      chartTransformOptions: {
        modelXRange: xAxisDescriptionProperty.value.createRangeForDomain( domainProperty.value, L, T )
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // Set the x-axis label based on domain.
    domainProperty.link( domain => {
      this.xAxisLabel.text = ( domain === Domain.TIME ) ? X_TIME_LABEL : X_SPACE_LABEL;
    } );

    // Update the x-axis range and decorations.
    Property.multilink(
      [ domainProperty, xAxisDescriptionProperty ],
      ( domain, xAxisDescription ) => {
        const value = ( domain === Domain.TIME ) ? T : L;
        const xMin = value * xAxisDescription.range.min;
        const xMax = value * xAxisDescription.range.max;
        this.chartTransform.setModelXRange( new Range( xMin, xMax ) );
        this.xGridLines.setSpacing( xAxisDescription.gridLineSpacing * value );
        this.xTickMarks.setSpacing( xAxisDescription.tickMarkSpacing * value );
        this.xTickLabels.setSpacing( xAxisDescription.tickLabelSpacing * value );
        this.xTickLabels.invalidateTickLabelSet();
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
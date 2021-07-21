// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChartNode is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWChartNode from '../../common/view/FMWChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketComponentsChart from '../model/WavePacketComponentsChart.js';

class WavePacketComponentsChartNode extends FMWChartNode {

  /**
   * @param {WavePacketComponentsChart} componentsChart
   * @param {Object} [options]
   */
  constructor( componentsChart, options ) {

    assert && assert( componentsChart instanceof WavePacketComponentsChart );

    // Fields of interest in componentsChart, to improve readability
    const L = componentsChart.wavePacket.L;
    const T = componentsChart.wavePacket.T;
    const domainProperty = componentsChart.domainProperty;
    const xAxisDescriptionProperty = componentsChart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = componentsChart.yAxisDescriptionProperty;

    options = merge( {
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value => new Text( Utils.toFixedNumber( value, 1 ), {
          font: FMWConstants.TICK_LABEL_FONT
        } )
      },
      yLabelSetOptions: {
        createLabel: value => new Text( Utils.toFixedNumber( value, 2 ), {
          font: FMWConstants.TICK_LABEL_FONT
        } )
      }
    }, options );

    super( options );

    // Message shown when we have an infinite number of components.
    const messageNode = new Text( fourierMakingWavesStrings.infiniteComponentsCannotBePlotted, {
      font: new PhetFont( 18 ),
      centerX: this.chartRectangle.centerX,
      bottom: this.chartRectangle.centerY - 5,
      maxWidth: 0.75 * this.chartRectangle.width
    } );
    this.addChild( messageNode );

    // Show the 'cannot plot...' message when we have an infinite number of components.
    componentsChart.wavePacket.k1Property.link( k1 => {
      messageNode.visible = ( k1 === 0 );
      //TODO other things to hide when messageNode is visible?
    } );

    // Adjust the x-axis label to match the domain.
    domainProperty.link( domain => {
      this.xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.meters :
               fourierMakingWavesStrings.units.milliseconds
      } );
    } );

    // Update the x axis to match its description and domain.
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

    // Update the y axis to match its description.
    yAxisDescriptionProperty.link( yAxisDescription => {

      //TODO autoscale should setModelYRange based on maxY of component data sets
      this.chartTransform.setModelYRange( yAxisDescription.range );
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
      this.yTickLabels.invalidateLabelSet();
    } );

    //TODO add plots, observe componentsChart.dataSetsProperty to update plots
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

fourierMakingWaves.register( 'WavePacketComponentsChartNode', WavePacketComponentsChartNode );
export default WavePacketComponentsChartNode;
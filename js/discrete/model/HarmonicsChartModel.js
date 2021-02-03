// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsChartModel is the model for the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWUtils from '../../common/FMWUtils.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

//TODO compute this based on zoom level and harmonic order, because higher-order harmonics require more points to look good
// Number of points in the data set for each harmonic. This value was chosen empirically, such that the highest order
// harmonic looks smooth when the chart is fully zoomed out.
const POINTS_PER_DATA_SET = 2000;

class HarmonicsChartModel {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number');

    // @public whether the Harmonics chart is visible
    this.chartVisibleProperty = new BooleanProperty( true );

    // @public the harmonics to be emphasized in the Harmonics chart, as the result of UI interactions
    this.emphasizedHarmonics = new EmphasizedHarmonics();

    // @public zoom level for the x axis, index into AxisDescription.X_AXIS_DESCRIPTIONS
    // This is shared by the Harmonics and Sum charts.
    this.xZoomLevelProperty = new NumberProperty( AxisDescription.X_DEFAULT_ZOOM_LEVEL, {
      numberType: 'Integer',
      range: new Range( 0, AxisDescription.X_AXIS_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<AxisDescription>} describes the properties of the x axis. dispose is not needed
    this.xAxisDescriptionProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => AxisDescription.X_AXIS_DESCRIPTIONS[ xZoomLevel ]
    );

    // @public {Property.<Vector2[]>[]} a data set for each harmonic, indexed in harmonic order
    // A data set is updated when any of its dependencies changes.
    this.harmonicDataSetProperties = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // {Vector2[]} the default data set for this harmonic
      const defaultHarmonicDataSet = createHarmonicDataSet( harmonic, this.xAxisDescriptionProperty.value.range,
        domainProperty.value, seriesTypeProperty.value, fourierSeries.L, fourierSeries.T, tProperty.value );

      // @public {Property.<Vector2[]>} the data set for this harmonic
      const harmonicDataSetProperty = new Property( defaultHarmonicDataSet, {
        isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
      } );
      this.harmonicDataSetProperties.push( harmonicDataSetProperty );

      //TODO duplication with defaultHarmonicDataSet above
      // Update the harmonic's data set when dependencies change. unmultilink is not needed.
      Property.lazyMultilink( [ harmonic.amplitudeProperty, fourierSeries.numberOfHarmonicsProperty,
          this.xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
        ( amplitude, numberOfHarmonics, xAxisDescription, domain, seriesType, t ) => {
          harmonicDataSetProperty.value = createHarmonicDataSet( harmonic, xAxisDescription.range,
            domain, seriesType, fourierSeries.L, fourierSeries.T, t );
        } );
    }

    // @private
    this.resetHarmonicsChartModel = () => {

      this.emphasizedHarmonics.clear();

      this.harmonicDataSetProperties.forEach( property => property.reset() );

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetHarmonicsChartModel();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

//TODO move to FourierSeries?
/**
 * Creates the data set for one harmonic.
 * @param {Harmonic} harmonic
 * @param {Range} xRange
 * @param {Domain} domain
 * @param {SeriesType} seriesType
 * @param {number} L
 * @param {number} T
 * @param {number} t
 * @returns {Vector2[]}
 */
function createHarmonicDataSet( harmonic, xRange, domain, seriesType, L, T, t ) {

  assert && assert( xRange instanceof Range, 'invalid xRange' );
  // other args are validated by getAmplitudeAt

  const dataSet = [];
  const dx = xRange.getLength() / POINTS_PER_DATA_SET;
  for ( let x = xRange.min; x <= xRange.max; x += dx ) {
    const y = FourierSeries.getAmplitudeAt( x, harmonic, domain, seriesType, L, T, t );
    dataSet.push( new Vector2( x, y ) );
  }
  return dataSet;
}

fourierMakingWaves.register( 'HarmonicsChartModel', HarmonicsChartModel );
export default HarmonicsChartModel;
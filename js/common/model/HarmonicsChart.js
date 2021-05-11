// Copyright 2021, University of Colorado Boulder

/**
 * HarmonicsChart is the model base class model for the 'Harmonics' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../discrete/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import Domain from './Domain.js';
import EmphasizedHarmonics from './EmphasizedHarmonics.js';
import FourierSeries from './FourierSeries.js';
import SeriesType from './SeriesType.js';

class HarmonicsChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;

    // @public the harmonics to be emphasized in the Harmonics chart, as the result of UI interactions
    this.emphasizedHarmonics = new EmphasizedHarmonics( {
      tandem: options.tandem.createTandem( 'emphasizedHarmonics' )
    } );

    /**
     * Creates the data set for a harmonic using current arg values.
     * @param {Harmonic} harmonic
     * @returns {Vector2[]}
     */
    const createDataSet = harmonic => {

      // Higher-frequency (higher-order) harmonics require more points to draw a smooth plot.
      // See documentation for FMWConstants.MAX_POINTS_PER_DATA_SET.
      const numberOfPoints = Math.ceil( FMWConstants.MAX_POINTS_PER_DATA_SET *
                                        harmonic.order / fourierSeries.harmonics.length );

      return harmonic.createDataSet( numberOfPoints, fourierSeries.L, fourierSeries.T,
        this.xAxisDescriptionProperty.value, domainProperty.value, seriesTypeProperty.value, tProperty.value );
    };

    // @public {Property.<Vector2[]>[]} a data set for each harmonic, indexed in harmonic order
    // A data set is updated when any of its dependencies changes.
    this.harmonicDataSetProperties = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // @public {Property.<Vector2[]>} the data set for this harmonic
      const harmonicDataSetProperty = new Property( createDataSet( harmonic ), {
        isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
        //TODO tandem
      } );
      this.harmonicDataSetProperties.push( harmonicDataSetProperty );

      // Update the harmonic's data set when dependencies change. unmultilink is not needed.
      Property.lazyMultilink( [ harmonic.amplitudeProperty, this.xAxisDescriptionProperty, domainProperty,
          seriesTypeProperty, tProperty ],
        () => { harmonicDataSetProperty.value = createDataSet( harmonic ); }
      );
    }
  }

  /**
   * @public
   */
  reset() {
    this.emphasizedHarmonics.clear();
    this.harmonicDataSetProperties.forEach( property => property.reset() );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'HarmonicsChart', HarmonicsChart );
export default HarmonicsChart;
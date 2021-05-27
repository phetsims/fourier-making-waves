// Copyright 2020-2021, University of Colorado Boulder

/**
 * ContinuousModel is the top-level model for the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ContinuousChartsModel from './ContinuousChartsModel.js';

const SPACING_BETWEEN_COMPONENTS_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class ContinuousModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public the range over which components are significant, in radians/meter
    this.significantWidthRange = new Range( 0, 24 * Math.PI );

    // @public index into SPACING_BETWEEN_COMPONENTS_VALUES, so that we have a linear value to control via Slider
    this.spacingBetweenComponentsIndexProperty = new NumberProperty( 3, {
      numberType: 'Integer',
      range: new Range( 0, SPACING_BETWEEN_COMPONENTS_VALUES.length ),
      tandem: options.tandem.createTandem( 'spacingBetweenComponentsIndexProperty' )
    } );

    // @public {DerivedProperty.<number>} spacing between Fourier components, in radians/meter. dispose is not needed
    this.spacingBetweenComponentsProperty = new DerivedProperty(
      [ this.spacingBetweenComponentsIndexProperty ],
      index => SPACING_BETWEEN_COMPONENTS_VALUES[ index ], {
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        tandem: options.tandem.createTandem( 'spacingBetweenComponentsProperty' )
      } );

    // @public center of the Gaussian wave packet, in radians/meter
    this.wavePacketCenterProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'wavePacketCenterProperty' )
    } );

    // @public Gaussian wave packet width in k space, in radians/meter
    this.kWidthProperty = new NumberProperty( 9.43, { //TODO where does this initial value come from?
      range: new Range( 1, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'kWidthProperty' )
    } );

    // @public Gaussian wave packet width in x space, in meters
    this.xWidthProperty = new NumberProperty( 0.107, { //TODO where does this initial value come from?
      range: new Range( 0.08, 1 ), //TODO range?
      tandem: options.tandem.createTandem( 'xWidthProperty' )
    } );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      validValues: [ Domain.SPACE, Domain.TIME ],
      tandem: options.tandem.createTandem( 'domainProperty' )
    } );

    // @public
    this.xSpaceEnvelopeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'xSpaceEnvelopeVisibleProperty' )
    } );

    // @public
    this.widthIndicatorsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'widthIndicatorsVisibleProperty' )
    } );

    // @public
    this.chartsModel = new ContinuousChartsModel( {
      tandem: options.tandem.createTandem( 'chartsModel' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.spacingBetweenComponentsIndexProperty.reset();
    this.wavePacketCenterProperty.reset();
    this.kWidthProperty.reset();
    this.xWidthProperty.reset();
    this.domainProperty.reset();
    this.xSpaceEnvelopeVisibleProperty.reset();
    this.widthIndicatorsVisibleProperty.reset();
    this.chartsModel.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'ContinuousModel', ContinuousModel );
export default ContinuousModel;
// Copyright 2020, University of Colorado Boulder

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
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWUtils from '../../common/FMWUtils.js';
import Domain from '../../discrete/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ContinuousChartsModel from './ContinuousChartsModel.js';

const SPACING_BETWEEN_COMPONENTS_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class ContinuousModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public the range over which components are significant, in radians/meter
    this.significantWidthRange = new Range( 0, 24 * Math.PI );

    // @public index into SPACING_BETWEEN_COMPONENTS_VALUES, so that we have a linear value to control via Slider
    this.spacingBetweenComponentsIndexProperty = new NumberProperty( 3, {
      numberType: 'Integer',
      range: new Range( 0, SPACING_BETWEEN_COMPONENTS_VALUES.length )
    } );

    // @public spacing between Fourier components, in radians/meter
    this.spacingBetweenComponentsProperty = new DerivedProperty(
      [ this.spacingBetweenComponentsIndexProperty ],
      index => SPACING_BETWEEN_COMPONENTS_VALUES[ index ]
    );

    // @public center of the Gaussian wave packet, in radians/meter
    this.wavePacketCenterProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI )
    } );

    // @public Gaussian wave packet width in k space, in radians/meter
    this.kWidthProperty = new NumberProperty( 9.43, { //TODO where does this initial value come from?
      range: new Range( 1, 4 * Math.PI )
    } );

    // @public Gaussian wave packet width in x space, in meters
    this.xWidthProperty = new NumberProperty( 0.107, { //TODO where does this initial value come from?
      range: new Range( 0.08, 1 ) //TODO range?
    } );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      validValues: [ Domain.SPACE, Domain.TIME ]
    } );

    // @public
    this.xSpaceEnvelopeVisibleProperty = new BooleanProperty( false );

    // @public
    this.widthIndicatorsVisible = new BooleanProperty( false );

    // @public
    this.chartsModel = new ContinuousChartsModel();

    // @private
    this.resetContinuousModel = () => {

      // Reset the charts
      this.chartsModel.reset();

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetContinuousModel();
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
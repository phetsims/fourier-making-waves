// Copyright 2021-2023, University of Colorado Boulder

/**
 * DomainChart is the base class model for all charts except the Amplitudes chart in the 'Discrete' and 'Wave Game'
 * screens. It is primarily responsive for the x (Domain) axis, hence the name.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';

export default class DomainChart {

  public readonly domainProperty: EnumerationProperty<Domain>;
  public readonly xAxisDescriptionProperty: Property<AxisDescription>;
  public readonly spaceMultiplier: number;
  public readonly timeMultiplier: number;

  // whether this chart is expanded
  public readonly chartExpandedProperty: Property<boolean>;

  /**
   * @param domainProperty - domain of the x-axis
   * @param xAxisDescriptionProperty - describes the x-axis
   * @param spaceMultiplier - multiplier for x values in the space and space-&-time Domains
   * @param timeMultiplier - multiplier for x values in the time Domain
   * @param tandem
   */
  protected constructor( domainProperty: EnumerationProperty<Domain>,
                         xAxisDescriptionProperty: Property<AxisDescription>,
                         spaceMultiplier: number,
                         timeMultiplier: number,
                         tandem: Tandem ) {

    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.spaceMultiplier = spaceMultiplier;
    this.timeMultiplier = timeMultiplier;

    this.chartExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'chartExpandedProperty' )
    } );
  }

  public reset(): void {
    this.chartExpandedProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'DomainChart', DomainChart );
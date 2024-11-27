// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteCalipersNode is the base class for tools used to measure a horizontal dimension of a harmonic in
 * the 'Discrete' screen. DiscreteCalipersNode's origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Domain from '../../common/model/Domain.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Harmonic from '../../common/model/Harmonic.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteMeasurementTool from '../model/DiscreteMeasurementTool.js';
import DiscreteMeasurementToolNode, { DiscreteMeasurementToolNodeOptions } from './DiscreteMeasurementToolNode.js';

type SelfOptions = EmptySelfOptions;

export type DiscreteCalipersNodeOptions = SelfOptions & DiscreteMeasurementToolNodeOptions;

export default class DiscreteCalipersNode extends DiscreteMeasurementToolNode {

  /**
   * @param tool
   * @param harmonics
   * @param emphasizedHarmonics
   * @param chartTransform - transform for the Harmonics chart
   * @param domainProperty
   * @param relevantDomains - the Domain values that are relevant for this tool
   * @param getModelValue - gets the quantity of the harmonic that is being measured
   * @param [providedOptions]
   */
  protected constructor( tool: DiscreteMeasurementTool, harmonics: Harmonic[], emphasizedHarmonics: EmphasizedHarmonics,
                         chartTransform: ChartTransform, domainProperty: EnumerationProperty<Domain>,
                         relevantDomains: Domain[], getModelValue: ( harmonic: Harmonic ) => number,
                         providedOptions: DiscreteCalipersNodeOptions ) {

    const options = optionize<DiscreteCalipersNodeOptions, SelfOptions, DiscreteMeasurementToolNodeOptions>()( {}, providedOptions );

    // {DerivedProperty.<Harmonic>} The harmonic associated with this tool.
    const harmonicProperty = new DerivedProperty( [ tool.orderProperty ], order => harmonics[ order - 1 ] );

    // Use CalipersNode via composition.
    const calipersNode = new CalipersNode();
    Multilink.multilink( [ tool.symbolStringProperty, harmonicProperty ],
      ( symbol, harmonic ) => calipersNode.setLabel( `${symbol}<sub>${harmonic.order}</sub>` ) );

    options.children = [ calipersNode ];

    super( tool, harmonicProperty, emphasizedHarmonics, domainProperty, relevantDomains, options );

    const update = ( harmonic: Harmonic ) => {

      // Compute the value in view coordinates
      const modelValue = getModelValue( harmonic );
      const viewValue = chartTransform.modelToViewDeltaX( modelValue );

      calipersNode.setMeasuredWidth( viewValue );
      calipersNode.setBeamAndJawsFill( harmonic.colorProperty );

      // Do not adjust position. We want the left jaw of the caliper to remain where it was, since that is
      // the jaw that the user should be positioning in order to measure the width of something.
    };

    // Update to match the selected harmonic.
    harmonicProperty.link( harmonic => update( harmonic ) );

    // Update when the range of the associated axis changes.
    chartTransform.changedEmitter.addListener( () => update( harmonicProperty.value ) );
  }
}

fourierMakingWaves.register( 'DiscreteCalipersNode', DiscreteCalipersNode );
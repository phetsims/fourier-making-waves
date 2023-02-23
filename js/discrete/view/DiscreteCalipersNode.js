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
import merge from '../../../../phet-core/js/merge.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteMeasurementTool from '../model/DiscreteMeasurementTool.js';
import DiscreteMeasurementToolNode from './DiscreteMeasurementToolNode.js';

export default class DiscreteCalipersNode extends DiscreteMeasurementToolNode {

  /**
   * @param {DiscreteMeasurementTool} tool
   * @param {Harmonic[]} harmonics
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {ChartTransform} chartTransform - transform for the Harmonics chart
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Domain[]} relevantDomains - the Domain values that are relevant for this tool
   * @param {function(harmonic:Harmonic):number} getModelValue - gets the quantity of the harmonic that is being measured
   * @param {Object} [options]
   */
  constructor( tool, harmonics, emphasizedHarmonics, chartTransform, domainProperty, relevantDomains, getModelValue, options ) {

    assert && assert( tool instanceof DiscreteMeasurementTool );
    assert && assert( Array.isArray( harmonics ) );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( Array.isArray( relevantDomains ) );
    assert && assert( typeof getModelValue === 'function' );

    options = merge( {}, options );

    // {DerivedProperty.<Harmonic>} The harmonic associated with this tool.
    const harmonicProperty = new DerivedProperty( [ tool.orderProperty ], order => harmonics[ order - 1 ] );

    // Use CalipersNode via composition.
    const calipersNode = new CalipersNode();
    Multilink.multilink( [ tool.symbolStringProperty, harmonicProperty ],
      ( symbol, harmonic ) => calipersNode.setLabel( `${symbol}<sub>${harmonic.order}</sub>` ) );

    assert && assert( !options.children, 'DiscreteCalipersNode sets children' );
    options.children = [ calipersNode ];

    super( tool, harmonicProperty, emphasizedHarmonics, domainProperty, relevantDomains, options );

    const update = harmonic => {

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
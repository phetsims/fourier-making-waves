// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteCalipersNode is the base class for tools used to measure a horizontal dimension of a harmonic in
 * the 'Discrete' screen. DiscreteCalipersNode's origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Domain from '../../common/model/Domain.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteMeasurementTool from '../model/DiscreteMeasurementTool.js';
import DiscreteMeasurementToolNode from './DiscreteMeasurementToolNode.js';

class DiscreteCalipersNode extends DiscreteMeasurementToolNode {

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
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( Array.isArray( relevantDomains ) );
    assert && assert( typeof getModelValue === 'function' );

    options = merge( {}, options );

    // Use CalipersNode via composition.
    const calipersNode = new CalipersNode();

    // {DerivedProperty.<Harmonic>} The harmonic associated with this tool.
    const harmonicProperty = new DerivedProperty( [ tool.orderProperty ], order => harmonics[ order - 1 ] );

    assert && assert( !options.children, 'DiscreteCalipersNode sets children' );
    options.children = [ calipersNode ];

    // Update to match the selected harmonic.
    function updateNodes() {

      const harmonic = harmonicProperty.value;

      // Compute the value in view coordinates
      const modelValue = getModelValue( harmonic );
      const viewValue = chartTransform.modelToViewDeltaX( modelValue );

      calipersNode.setMeasuredWidth( viewValue );
      calipersNode.setBeamAndJawsFill( harmonic.colorProperty );
      calipersNode.setLabel( `${tool.symbol}<sub>${harmonic.order}</sub>` );

      // Do not adjust position. We want the left jaw of the caliper to remain where it was, since that is
      // the jaw that the user should be positioning in order to measure the width of something.
    }

    // Initialize child Nodes before deriving drag bounds and calling super
    updateNodes();

    super( tool, harmonicProperty, emphasizedHarmonics, domainProperty, relevantDomains, updateNodes, options );

    // Update when the range of the associated axis changes.
    chartTransform.changedEmitter.addListener( updateNodes );
  }
}

fourierMakingWaves.register( 'DiscreteCalipersNode', DiscreteCalipersNode );
export default DiscreteCalipersNode;
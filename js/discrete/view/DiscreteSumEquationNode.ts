// Copyright 2020-2024, University of Colorado Boulder

/**
 * DiscreteSumEquationNode is the equation that appears above the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { Node, NodeOptions, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import SumSymbolNode from '../../common/view/SumSymbolNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationForm from '../model/EquationForm.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const EQUAL_TO = MathSymbols.EQUAL_TO;

type SelfOptions = {
  font?: PhetFont;
};

type DiscreteSumEquationNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'visiblePropertyOptions' | 'maxWidth'> &
  PickRequired<NodeOptions, 'tandem'>;

export default class DiscreteSumEquationNode extends Node {

  private readonly disposeSumEquationNode: () => void;

  public constructor( numberOfHarmonicsProperty: TReadOnlyProperty<number>,
                      domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      equationFormProperty: EnumerationProperty<EquationForm>,
                      providedOptions: DiscreteSumEquationNodeOptions ) {

    const options = optionize<DiscreteSumEquationNodeOptions, SelfOptions, NodeOptions>()( {

      // DiscreteSumEquationNodeOptions
      font: FMWConstants.EQUATION_FONT
    }, providedOptions );

    // Everything to the left of the summation symbol, set in multilink below
    const leftNode = new RichText( '', {
      font: options.font
    } );

    // Capital sigma, summation symbol
    const summationNode = new SumSymbolNode( FMWSymbols.nMarkupStringProperty, 1, numberOfHarmonicsProperty );

    // Everything to the right of the summation symbol, set in multilink below
    const rightNode = new RichText( '', {
      font: options.font
    } );

    options.children = [ leftNode, summationNode, rightNode ];

    super( options );

    // Update the equation to match the Domain and math form.
    // Because we are using one of the EquationMarkup functions, our dependencies must include EquationMarkup.STRING_PROPERTY_DEPENDENCIES.
    const multilink = Multilink.multilinkAny(
      [ domainProperty, seriesTypeProperty, equationFormProperty, ...EquationMarkup.STRING_PROPERTY_DEPENDENCIES ],
      () => {

        const domain = domainProperty.value;
        const seriesType = seriesTypeProperty.value;
        const equationForm = equationFormProperty.value;

        // F(...) =
        leftNode.string = `${EquationMarkup.getFunctionOfMarkup( domain )} ${EQUAL_TO}`;

        summationNode.left = leftNode.right + 2;
        summationNode.y = leftNode.y + 5; // lower summation a bit, determined empirically

        rightNode.string = EquationMarkup.getGeneralFormMarkup( domain, seriesType, equationForm );
        rightNode.left = summationNode.right + 2;
        rightNode.y = leftNode.y;
      } );

    this.disposeSumEquationNode = () => {
      multilink.dispose();
    };
  }

  /**
   * This equation is used in 2 places: above the Sum chart, and in the Expanded Form dialog.
   * In the former, one instance is created, and it exists for the lifetime of the sim.
   * In the latter, a new instance is created each time the dialog is opened, and therefore needs to be disposed.
   */
  public override dispose(): void {
    this.disposeSumEquationNode();
    super.dispose();
  }
}

fourierMakingWaves.register( 'DiscreteSumEquationNode', DiscreteSumEquationNode );
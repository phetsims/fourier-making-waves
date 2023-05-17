// Copyright 2021-2023, University of Colorado Boulder

/**
 * CaliperCheckbox is a checkbox for changing the visibility of measurement tools that look like calipers.
 * It shows a small calipers icon, and a label changes dynamically to match the Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class CaliperCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {TReadOnlyProperty.<string>} spaceSymbolStringProperty
   * @param {TReadOnlyProperty.<string>} timeSymbolStringProperty
   * @param {Object} [options]
   */
  constructor( visibleProperty, domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty, options ) {

    assert && AssertUtils.assertPropertyOf( visibleProperty, 'boolean' );
    assert && assert( domainProperty instanceof EnumerationProperty );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
      calipersNodeOptions: {
        measuredWidth: 65,
        labelPosition: 'left', // put label to left of caliper, to minimize vertical space
        scale: 0.5,
        richTextOptions: {
          font: new PhetFont( 25 )
        }
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const caliperNode = new CalipersNode( options.calipersNodeOptions );

    Multilink.multilink(
      [ domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty ],
      ( domain, spaceSymbol, timeSymbol ) =>
        caliperNode.setLabel( ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol )
    );

    super( visibleProperty, caliperNode, options );
  }
}

fourierMakingWaves.register( 'CaliperCheckbox', CaliperCheckbox );
// Copyright 2021, University of Colorado Boulder

/**
 * CaliperCheckbox is a checkbox for changing the visibility of measurement tools that look like calipers.
 * It shows a small calipers icon, and a label changes dynamically to match the Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class CaliperCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {string} spaceSymbol
   * @param {string} timeSymbol
   * @param {Object} [options]
   */
  constructor( visibleProperty, domainProperty, spaceSymbol, timeSymbol, options ) {

    assert && AssertUtils.assertPropertyOf( visibleProperty, 'boolean' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( typeof spaceSymbol === 'string' );
    assert && assert( typeof timeSymbol === 'string' );

    options = merge( {
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

    domainProperty.link( domain => {
      caliperNode.setLabel( ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol );
    } );

    super( caliperNode, visibleProperty, options );
  }
}

fourierMakingWaves.register( 'CaliperCheckbox', CaliperCheckbox );
export default CaliperCheckbox;
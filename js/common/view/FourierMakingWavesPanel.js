// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesPanel is a specialization of Panel that provides a more convenient API for creating a fixed-width Panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FourierMakingWavesPanel extends Panel {

  /**
   * @param {Node} content
   * @param {Object} [options]
   */
  constructor( content, options ) {

    assert && assert( content instanceof Node, 'invalid content' );

    options = merge( {
      fixedWidth: null // {number|null} optional fixed width
    }, options );

    assert && assert( options.fixedWidth === null || options.fixedWidth > 0, `invalid fixedWidth: ${options.fixedWidth}` );

    if ( options.fixedWidth ) {
      assert && assert( options.minWidth === undefined, 'FourierMakingWavesPanel sets minWidth' );
      assert && assert( options.maxWidth === undefined, 'FourierMakingWavesPanel sets maxWidth' );
      options.minWidth = options.fixedWidth;
      options.maxWidth = options.fixedWidth;
    }

    super( content, options );

    // @private
    this.content = content;
  }
}

fourierMakingWaves.register( 'FourierMakingWavesPanel', FourierMakingWavesPanel );
export default FourierMakingWavesPanel;
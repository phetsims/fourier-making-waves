// Copyright 2021, University of Colorado Boulder

/**
 * HarmonicEmphasisListener emphasizes a harmonic that is associated with a Node. When the pointer state is
 * pressed or hovering, the harmonic associated with the Node is emphasized by adding it to an ObservableArrayDef.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';

class HarmonicEmphasisListener extends PressListener {

  /**
   * @param {Property.<Harmonic>} harmonicProperty
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics - the set of harmonics to be emphasized
   * @param {Object} [options]
   */
  constructor( harmonicProperty, emphasizedHarmonics, options ) {

    assert && AssertUtils.assertPropertyOf( harmonicProperty, Harmonic );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics, 'invalid emphasizedHarmonics' );

    options = merge( {
      debugName: 'harmonicEmphasisListener' // for debugging
    }, options );

    super( options );

    // If the associated harmonic changes, interrupt interaction.
    harmonicProperty.lazyLink( () => this.interrupt() );

    // Emphasize the harmonic when the pointer state is pressed or hovering. unlink is not needed
    this.isHighlightedProperty.lazyLink( isHighlighted => {
      const harmonic = harmonicProperty.value;
      phet.log && phet.log( `${options.debugName} isHighlighted=${isHighlighted}` );
      if ( isHighlighted ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesListener( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates a HarmonicEmphasisListener for a specific static harmonic.
   * @returns {HarmonicEmphasisListener}
   * @public
   */
  static withHarmonic( harmonic, emphasizedHarmonics, options ) {
    return new HarmonicEmphasisListener( new Property( harmonic ), emphasizedHarmonics, options );
  }
}

fourierMakingWaves.register( 'HarmonicEmphasisListener', HarmonicEmphasisListener );
export default HarmonicEmphasisListener;
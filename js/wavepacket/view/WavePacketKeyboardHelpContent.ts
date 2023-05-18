// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Packet' screen.
 * It's identical to the keyboard-help dialog in the 'Discrete' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DiscreteKeyboardHelpContent from '../../discrete/view/DiscreteKeyboardHelpContent.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class WavePacketKeyboardHelpContent extends DiscreteKeyboardHelpContent {}

fourierMakingWaves.register( 'WavePacketKeyboardHelpContent', WavePacketKeyboardHelpContent );
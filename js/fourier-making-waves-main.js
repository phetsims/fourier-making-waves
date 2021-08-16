// Copyright 2020-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Vector2 from '../../dot/js/Vector2.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import FMWConstants from './common/FMWConstants.js';
import WavePacketScreen from './wavepacket/WavePacketScreen.js';
import DiscreteScreen from './discrete/DiscreteScreen.js';
import fourierMakingWavesStrings from './fourierMakingWavesStrings.js';
import WaveGameScreen from './waveGame/WaveGameScreen.js';

const fourierMakingWavesTitleString = fourierMakingWavesStrings[ 'fourier-making-waves' ].title;

const simOptions = {

  //TODO https://github.com/phetsims/fourier-making-waves/issues/2 complete credits
  credits: {
    leadDesign: 'Amy Rouinfar, Sam McKagan',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Wendy Adams, Mike Dubson, Danielle Harlow, Ariel Paul, Kathy Perkins, Carl Weiman',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  },
  hasKeyboardHelpContent: true
};

simLauncher.launch( () => {

  // Vector2 pooling is used only in the Discrete screen. That screen has animation in the 'space & time' domain,
  // and we want to avoid the animation pause that occurs due to garbage collection.  So we'll need a large enough
  // pool for the Discrete screen.  That screen has 11 harmonic plots, 1 sum plot, and 1 infinite harmonic plot.
  // The number of points in a harmonic plots varies based on the frequency of the harmonic (higher frequency requires
  // more points for a smooth plot) by the maximum is FMWConstants.MAX_HARMONICS.  So here we compute what should
  // be a safe maximum.
  Vector2.maxPoolSize = ( FMWConstants.MAX_HARMONICS + 2 ) * FMWConstants.MAX_POINTS_PER_DATA_SET;

  const sim = new Sim( fourierMakingWavesTitleString, [
    new DiscreteScreen( { tandem: Tandem.ROOT.createTandem( 'discreteScreen' ) } ),
    new WaveGameScreen( { tandem: Tandem.ROOT.createTandem( 'waveGameScreen' ) } ),
    new WavePacketScreen( { tandem: Tandem.ROOT.createTandem( 'wavePacketScreen' ) } )
  ], simOptions );
  sim.start();
} );
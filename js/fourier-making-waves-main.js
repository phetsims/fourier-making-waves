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
import ContinuousScreen from './continuous/ContinuousScreen.js';
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
  }
};

simLauncher.launch( () => {

  //TODO Tune this for the needs of all screens, and the value of FMWConstants.MAX_POINTS_PER_DATA_SET.
  // Discrete: 11 harmonics, 1 sum
  // Wave Game: 5 levels, each with 11 harmonics and 2 sums
  // Continuous: ??
  Vector2.maxPoolSize = 2000000;

  const sim = new Sim( fourierMakingWavesTitleString, [
    new DiscreteScreen( { tandem: Tandem.ROOT.createTandem( 'discreteScreen' ) } ),
    new WaveGameScreen( { tandem: Tandem.ROOT.createTandem( 'waveGameScreen' ) } ),
    new ContinuousScreen( { tandem: Tandem.ROOT.createTandem( 'continuousScreen' ) } )
  ], simOptions );
  sim.start();
} );
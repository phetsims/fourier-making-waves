// Copyright 2020-2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import DiscreteScreen from './discrete/DiscreteScreen.js';
import FourierMakingWavesStrings from './FourierMakingWavesStrings.js';
import WaveGameScreen from './waveGame/WaveGameScreen.js';
import WavePacketScreen from './wavepacket/WavePacketScreen.js';

const titleStringProperty = FourierMakingWavesStrings[ 'fourier-making-waves' ].titleStringProperty;

simLauncher.launch( () => {

  const screens = [
    new DiscreteScreen( Tandem.ROOT.createTandem( 'discreteScreen' ) ),
    new WaveGameScreen( Tandem.ROOT.createTandem( 'waveGameScreen' ) ),
    new WavePacketScreen( Tandem.ROOT.createTandem( 'wavePacketScreen' ) )
  ];

  const sim = new Sim( titleStringProperty, screens, {
    credits: {
      leadDesign: 'Amy Rouinfar, Sam McKagan',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Wendy Adams, Mike Dubson, Danielle Harlow, Ariel Paul, Kathy Perkins, Carl Wieman',
      qualityAssurance: 'Logan Bray, Clifford Hardin, Brooklyn Lash, Emily Miller, Nancy Salpepi, Kathryn Woessner',
      thanks: 'We gratefully acknowledge support from STROBE NSF Science & Technology Center Grant DMR-1548924. ' +
              'Any opinions, findings, and conclusions or recommendations expressed in this material are those of ' +
              'the author(s) and do not necessarily reflect the views of the National Science Foundation.'
    }
  } );

  sim.start();
} );
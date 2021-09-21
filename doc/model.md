# Fourier: Making Waves - model description

@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in PhET's _Fourier: Making Waves_ simulation.

## Prerequisites

It's assumed that the reader is familiar with Fourier Series, harmonics, and wave packets.

## Symbols

A summary of the symbols used in this simulation:

* A = amplitude
* A<sub>n</sub> = amplitude of the n<sup>th</sup> harmonic
* f = frequency, in Hz = 1 / T
* F = function of
* λ = wavelength, in m (used interchangeably with L)
* k = spatial wave number, in rad/m = 2π / λ
* k<sub>0</sub> = the mean wave number, which defines the wave packet's center
* L = string length, if this were a plucked string, in m (used interchangeably with λ)
* n = harmonic number, order, or mode
* π = pi
* σ<sub>k</sub> = the standard deviation of k, a measure of wave-packet width
* σ<sub>t</sub> = the standard deviation of t, a measure of wave-packet width
* σ<sub>x</sub> = the standard deviation of x, a measure of wave-packet width
* σ<sub>ω</sub> = the standard deviation of ω, a measure of wave-packet width
* t = time, in ms
* T = period, in ms = 1 / f
* ω = angular wave number, in rad/ms = 2π / T
* ω<sub>0</sub> = the mean angular wave number, which defines the wave packet's center
* x = position in space along L, in m

## Terminology

A _Fourier Series_ decomposes a periodic function into a set of sines or cosines. The
_series type_ refers to whether the Fouriers Series uses sines (a _sine series_) or cosines (a _cosine series_[](url)).

The sines or cosines are referred to as _harmonics_ or _components_, terms that you can feel free to
use interchangeably.  For pedagogical reasons, the **Discrete** and **Wave Game** screens refer to _harmonics_ 
while the **Wave Packet** screen refers to _components_. The more harmonics that are used in a Fourier Series, 
the more accurately a periodic function can be approximated.

Each harmonic has an _order_ or _harmonic number_, numbered starting from 1. The
_fundamental harmonic_ (or simply _fundamental_) is the lowest frequency of the periodic function, its order is 1,
and its amplitude is A<sub>1</sub>.

## Discrete screen

The **Discrete** screen models a
single [FourierSeries](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/FourierSeries.js)
with a variable number (1...11) of Harmonics.
Each [Harmonic](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/Harmonic.js)
has an amplitude with variable range [-1.5,1.5]. The sum is computed by sampling the amplitude of each harmonic at
points in space or time, and summing their corresponding amplitudes.

The fundamental harmonic has a wavelength of 1 m. Its frequency is 440 Hz, chosen to match the tuning standard for the
musical note of A above middle C.

The method of computing a Harmonic's amplitude depends on the x-axis domain (space, time, or space and time) and whether
we have a sine series or a cosine series. The set of 6 equations for computing amplitude can be found in
[getAmplitudeFunction.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/getAmplitudeFunction.js)
These functions correspond to the mode (_n_) equation forms, selectable from the
'Equation' combo box.

Preset waveforms are selected via the 'Waveform' combo box, including sinusoid, square, sawtooth, triangle, and wave
packet. When you select one of these presets, amplitudes for the harmonics are computed using an equation that is
specific to that preset. (Wave packet is an exception:
we use a set of hard-coded amplitudes.)
See [Waveform.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/discrete/model/Waveform.js)
for the equations used. For square, sawtooth, and triangle, Waveform.js also contains the points used to plot exact
versions of those waveforms, for comparison with the Fourier Series approximation.

The **Discrete** screen also offers a choice of equation forms, selectable via the
'Equation' combo box. This selection only affects which equation is displayed. Because all equations yield equivalent
results, the model always uses the mode (_n_) equation form.

## Wave Game screen

The **Wave Game** screen builds on the **Discrete** screen, and presents the user with challenges to be solved. There
are 2 Fourier Series in this screen: the "answer series" is the answer to a challenge, while the "guess series" is the
user's guess. When the amplitudes of the guess series match the amplitudes of the answer series, the user has solved the challenge. 

The Amplitudes (top) chart allows the user to set amplitudes for the guess series. The Harmonics (middle) chart plots each harmonic in the
guess series. The Sum (bottom) chart shows the guess series (in black) superimposed on top of the answer series (in
hot pink).

Each level of the game has a different number of non-zero harmonics in the challenge, and a different number of 'Amplitude 
Controls' (sliders and keypads) for setting amplitudes. Each challenge includes some controls for
zero-amplitude harmonics, to make the challenges a bit more difficult. The student can increase the number of
zero-amplitude controls using the 'Amplitude Controls' spinner, but each level has a minimum number of controls.

Here is a summary of each game level:

Level | non-zero harmonics | Amplitude Controls |
--- | --- | --- |
1 | 1 | 2 |
2 | 2 | 3 |
3 | 3 | 5 |
4 | 4 | 6 | 
5+ | 5 or more | 11 |

Challenges are generated randomly, and the game is open-ended - you can play forever!
One point (one star) is rewarded for each challenge that is successfully completed. After successfully completing 5
challenges, the student gets a reward.

## Wave Packet screen

The **Wave Packet** screen is quite different from the other screens, but is still built on the same underlying
mathematics.

The Fourier Series can be varied by changing 'Component Spacing', which in turn changes the number of components. The
wave packet can also be adjusted by changing its center and width. The underlying equations for computing the component
waveforms are the same as those used in the others screens, found
in [getAmplitudeFunction.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/getAmplitudeFunction.js)
.

A simplifying assumption in this screen's model is that λ (wavelength) and T (period) are both 1 unit. This is a
performance optimization that allows us to change representations in the view to match the domain
(space or time) while not needing to recompute values.

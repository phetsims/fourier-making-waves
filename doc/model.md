# Fourier: Making Waves - model description

@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in PhET's _Fourier: Making Waves_ simulation. It's assumed
that the reader is familiar with Fourier Series and wave packets.

## Mathematical symbols:

* A = amplitude
* A<sub>n</sub> = amplitude of the n<sup>th</sup> harmonic
* f = frequency, in Hz = 1 / T
* F = function of
* λ = wavelength, in m = L
* k = spatial wave number, in rad/m = 2π / λ
* k<sub>0</sub> = the mean wave number, which defines the wave packet's center
* L = string length, if this were a plucked string, in m = λ
* n = harmonic number, order, or mode
* π = pi
* σ = Gaussian wave packet width, in rad/m
* σ<sub>k</sub> = the standard deviation of k
* σ<sub>t</sub> = the standard deviation of t
* σ<sub>x</sub> = the standard deviation of x
* σ<sub>ω</sub> = the standard deviation of ω
* t = time, in ms
* T = period, in ms = 1 / f
* ω = angular wave number, in rad/ms = 2π / T
* ω<sub>0</sub> = the mean angular frequency, which defines the wave packet's center
* x = position in space along L, in m

## Terminology

* harmonic order, or order
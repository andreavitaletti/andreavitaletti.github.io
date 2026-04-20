# Filters

## Hampel Filters

![](assets/images/2025-02-21-09-45-20.png "source: https://medium.com/@migueloteropedrido/hampel-filter-with-python-17db1d265375")

## Moving Average

![](assets/images/MA.png "source: https://en.wikipedia.org/wiki/Moving_average#/media/File:Lissage_sinus_bruite_moyenne_glissante.svg")


## Kalman Filters

A very nice, rich an exhaustive source of documentation for Kalman filters is available [here](https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python)

The main idea is that both our prior knowledge and the measurements of our sensors are to some extent inaccurate. To model such inaccuracy we use a Gaussian with mean $\mu$ and variance $\rho$

![](assets/images/2023-08-22-09-46-59.png)

At each iteration we have our prior knowledge (in blue) and a new measurement (in orange) and we account for both source of information computing an average (in green)

![](assets/images/2023-08-22-09-50-26.png)

> The final mean gets shifted which is in between the two old means, the mean of the prior, and the mean of the measurement. It’s slightly further on the measurement side because the measurement was more certain as to where the vehicle is than prior. The more certain we are, the more we pull the mean on the direction of the certain answer. [source](https://medium.com/analytics-vidhya/kalman-filters-a-step-by-step-implementation-guide-in-python-91e7e123b968)

Iteration after iteration the variance decreases (the spread of the blue gaussian), providing a better estimation (in green) despite the noisy measurements (in red) [source](https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python)

![](assets/images/evolution.gif)

A reference library is available [here](https://github.com/denyssene/SimpleKalmanFilter)


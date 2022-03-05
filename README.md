# Snek Planes
An implementation  of the classic Snake game for web browsers, featuring random terrain generation. Graphics engine running on Pixi.js with a custom management system built on top of it.  

[Check it out here](https://ninjaboynaru.github.io/snek/)


_Artowrk by [Kenny](https://www.kenney.nl/)_


## Env Varibales
Define env variblaes in a `.env` file
* `ENV=`: `development` or `production` to change bundled code type
* `DEV_MODE=` `true` to enable certain developer assisting features, `false` otherwise

## DEV_MODE
Dev features enabled by setting `DEV_MODE=true`
* No death
* Press the `SPACE` key to move instead of automatic movement
* `t` key to clear all coins
* `y` key to spawn coins up to the natural limit defined by the game's configuration
'use strict';

const ca = document.getElementById('submenu');
const sub = ca.getContext('2d');
const SCREEN_WID = 300;
const SCREEN_HEI = 500;

ca.width  = SCREEN_WID;
ca.height = SCREEN_HEI;

sub.clearRect(0, 0,  300, 500);
sub.font = FONT;
sub.fillStyle = 'black';
sub.fillText(`Score： ${score}`,10,33);
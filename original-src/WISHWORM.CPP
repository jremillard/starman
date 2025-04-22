#include <graphics.h>
#include <stdlib.h>
#include <math.h>
#include "wishworm.h"
#include "fast_mat.h"

const float PI = 3.14159265359;

inline float to_rad(float in)
	{
	return(in * PI / 180);
	}

inline void wish_worm::clear(void)
{
setcolor(0);
put_image();
setcolor(15);
}


wish_worm::wish_worm(void)
{
while ((color = random(getmaxcolor())+1) == 8);
ycor = random(getmaxy());
xcor = 2 * getmaxx() + random(2 * getmaxx());
step = random(30);
turn = 0;
}

wish_worm::~wish_worm()
{
clear();
}

void wish_worm::put_image(void)
{
int angle;
if ((xcor > getmaxx() + 40) ||
		(xcor < -40) ||
		(ycor > getmaxy() + 40) ||
		(ycor < -40) )
		return;

if (step < 17)
	{
	switch (step)
		{
		case 0: angle = 90; break;
		case 1: angle = 58; break;
		case 2: angle = 39; break;
		case 3: angle = 27; break;
		case 4: angle = 21; break;
		case 5: angle = 17; break;
		case 6: angle = 14; break;
		case 7: angle = 13; break;
		case 8: angle = 12; break;
		case 9: angle = 11; break;
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
		case 17: angle = 11; break;
		default: angle = 11; break;
		}
	}
else
	angle = 6 * (step - 15);

float sin_angle = Dfast_sin(turn + angle);
float cos_angle = Dfast_cos(turn + angle);

circle(xcor,ycor,5);
line(xcor,ycor,xcor - 5 * Dfast_cos(20+turn),ycor - 5 * Dfast_sin(20+turn));
line(xcor,ycor,xcor - 5 * Dfast_cos(-20+turn),ycor - 5 * Dfast_sin(-20+turn));
line(xcor+5 * Dfast_cos(turn),ycor + 5 * Dfast_sin(turn),xcor+10*Dfast_cos(turn),ycor + 10*Dfast_sin(turn));

int xleg = xcor + 10 *Dfast_cos(turn);
int yleg = ycor + 10 *Dfast_sin(turn);
line(xleg,yleg,xleg + cos_angle * 12,yleg + sin_angle * 12); 
line(xleg,yleg,xleg + Dfast_cos(turn - angle) * 12,yleg + Dfast_sin(turn - angle) * 12);
}

void wish_worm::draw(void)
{
clear();

float cos_dir = Dfast_cos(turn);
float sin_dir = Dfast_sin(turn);

++step;
if (step > 30)
	step = 0;

switch (step)
  {
  case 0: break;
	case 1: xcor -= cos_dir; ycor -= sin_dir; break;
	case 2: xcor -= 3*cos_dir; ycor -= 3*sin_dir; break;
	case 3: xcor -= 5*cos_dir; ycor -= 5*sin_dir; break;
	case 4: xcor -= 4*cos_dir; ycor -= 4*sin_dir; break;
	case 5: xcor -= 3*cos_dir; ycor -= 3*sin_dir; break;
	case 6: xcor -= 2*cos_dir; ycor -= 2*sin_dir; break;
	case 7: xcor -= 2*cos_dir; ycor -= 2*sin_dir; break;
	case 8: 
	case 9:
	case 10:
	case 11:
	case 12: xcor -= cos_dir; ycor -= sin_dir;break;
	case 20: xcor += cos_dir; ycor += sin_dir;break;
	default: break;
	}
if ((((xcor < -20) && ((turn < 90 )) || (turn > 270 ))) ||
	 ((xcor > getmaxx() + 20) && (turn < 270 ) && (turn > 90 )) ||
	 ((ycor < -20) && (turn < 180 )) ||
	 ((ycor > getmaxy() + 20) && (turn > 180 )) )
 {
 turn = random(360);
 xcor = (Dfast_cos(turn) * getmaxx() * 2) + (random(getmaxx()) - (getmaxx() / 2));
 ycor = (Dfast_sin(turn) * getmaxy() * 2) + (random(getmaxy()) - (getmaxy() / 2));
 }
setcolor(color);
put_image();
setcolor(15);
}


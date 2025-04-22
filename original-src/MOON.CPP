#include <stdlib.h>
#include <graphics.h>
#include <math.h>
#include "moon.h"
#include "fast_mat.h"

const float PI = 3.14159265359;

inline void moon::clear(void)
{
setcolor(0);
put_image();
setcolor(15);
}

moon::moon(void)
{
angle = 0;
ycor = 50 + random(70);
xcor = getmaxx() * 2;
}

moon::~moon()
{
clear();
}

void moon::put_image(void)
{
if ((xcor > getmaxx() + 80) ||
		(xcor < -80) ||
		(ycor > getmaxy() + 80) ||
		(ycor < -80) )
		return;

fillellipse(xcor,ycor,10,10);
ellipse(xcor,ycor,-45,45,15,3);
ellipse(xcor,ycor,135,225,15,3);
int r = 30 + 9 * Dfast_cos(2 * angle);
ellipse(r * Dfast_cos(angle) + xcor,r * Dfast_sin(angle) + ycor + Dfast_cos(angle)*20,0,360,3,4);
}

void moon::draw(void)
{
clear();
angle += 1;
--xcor;
if (xcor < -30 ) 
	{
	angle = 0;
	xcor = getmaxx() * 4;
	}
put_image();
}

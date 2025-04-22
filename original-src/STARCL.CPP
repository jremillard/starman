#include <graphics.h>
#include <math.h>
#include <stdlib.h>
#include "starcl.h"
#include "fast_mat.h"

inline void stars::put_image(void)
{
putpixel(xcor,ycor,color);
}

inline void stars::clear(void)
{
putpixel(xcor,ycor,0);
}

void stars::fall(void)
{
count = 0;
vel = -4;
acc = 1;
angle = 90;
}

stars::stars(void)
{
xcor = random(getmaxx());
ycor = random(getmaxy());
reset = 30 + random(300);
vel = acc = count = 0;
angle = 0;
color = 15;
put_image();
}

void stars::set(int x,int y)
{
xcor = x;
ycor = y;
}

stars::~stars()
{
clear();
}


void stars::race(void)
{
count = 0;
angle = (1 + random(360));
vel = 5;
}

void stars::draw(void)
{
++count;
if (count > reset)
  {
	clear();
	color = 15;
	xcor = random(getmaxx());
	ycor = random(getmaxy());
	vel = acc = count = 0;
	if (random(300) == 3)
		fall();
	if (random(700) == 1)
		{
		color = 12;
		race();
		}
	put_image();
  }

if ((vel != 0) || (acc != 0))
  {
  clear();
	xcor += Dfast_cos(angle) * vel;
	ycor += Dfast_sin(angle) * vel;
  vel += acc;
  vel += acc;
  if ((xcor < 0) || (ycor < 0))
		vel = acc = 0;

	if (xcor > getmaxx())
		acc = vel = 0;  

	if (ycor > getmaxy())
    {
		acc = vel = 0;
		ycor = getmaxy();
		}
	put_image();
	}
}


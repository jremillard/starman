#include <graphics.h>
#include <stdlib.h>
#include <dos.h>
#include <math.h>
#include <iostream.h>
#include "tic_toc.h"
#include "fast_mat.h"

const float PI = 3.14159265359;

tic_toc::tic_toc(void)
{
refresh = 0;
while((xvel = random(3) - 1) == 0);
while((yvel = random(3) - 1) == 0);
struct  time t;
gettime(&t);
hour  = t.ti_hour;
min = t.ti_min;
sec = t.ti_sec;
ycor = random(getmaxy());
xcor = random(getmaxx());
xping = 0;
yping = 0;
xscale = 1.0;
yscale = 1.0;
}

tic_toc::~tic_toc()
{
clear();
}

void tic_toc::put_image(void)
{
ellipse(xcor,ycor,0,360,15*fabs(xscale),15 * fabs(yscale));
int angle = ( (360) / (12) ) * (hour + (min / 60)) - 90;
line(xcor,ycor,xcor + Dfast_cos(angle) * 8 * xscale,ycor + Dfast_sin(angle) * 8 * yscale);

angle = ( 360 / (60) ) * (min) - 	90;
line(xcor,ycor,xcor + Dfast_cos(angle) * 11 * xscale,ycor + Dfast_sin(angle) * 11 * yscale);

angle = ( 360  / (60) ) * (sec) -  90;
line(xcor + Dfast_cos(angle) * 11 * xscale,ycor + Dfast_sin(angle) * 11 * yscale,xcor + Dfast_cos(angle) * 15 *xscale,ycor + Dfast_sin(angle) * 15 * yscale);
}

void tic_toc::clear(void)
{
setcolor(0);
put_image();
setcolor(15);
}

void tic_toc::draw(void)
{
clear();
if (xping)
	{
	++xping;
	xscale = fast_cos(199.0 / sqrt(sqrt(xping)));
	if (xping > 100)
		{
		xscale = 1.0;
		xping = 0;
		}
	}
if (yping)
	{
	++yping;
	yscale = fast_cos(199.0 / sqrt(sqrt(yping)));
	if (yping > 100)
		{
		yscale = 1.0;
		yping = 0;
		}
	}
++refresh;
xcor += xvel;
ycor += yvel;
if (xcor + 16 > getmaxx())
	{
	yping = 10;
	xvel = -1;
	}
if (xcor - 16 < 0)
	{
	yping = 10;
	xvel = 1;
	}
if (ycor - 16 < 0)
	{
	xping = 10;
	yvel = 1;
	}
if (ycor + 16  > getmaxy())
	{
	xping = 10;
	yvel = -1;
	}
if (refresh > 20)
	{
	struct time t;
	refresh = 0;
	gettime(&t);
	hour  = t.ti_hour;
	min = t.ti_min;
	sec = t.ti_sec;
	}
put_image();
}

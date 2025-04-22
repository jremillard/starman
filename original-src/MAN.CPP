#include <graphics.h>
#include <stdlib.h>
#include <math.h>
#include "man.h"
#include "fast_mat.h"

const float PI = 3.14159265359;

man::man(void)
{
angle = 0;
ycor = random(getmaxy()) / 2;
xcor = getmaxx() * 10;
}

man::~man()
{
clear();
}

void man::put_image(void)
{
if ((xcor > getmaxx() + 40) ||
		(xcor < -40) ||
		(ycor > getmaxy() + 40) ||
		(ycor < -40) )
		return;

float xadj = Dfast_cos(angle);
float yadj = Dfast_sin(angle);

circle(xcor,ycor,5);
line(xcor+(xadj *4),ycor+(yadj * 3),xcor+(xadj * 25),ycor+(yadj * 19)); // Body
line(xcor+(xadj *10),ycor+(yadj * 6),xcor+(xadj * 16),ycor-(yadj * 5)); // top Arm
line(xcor-(xadj *3),ycor+(yadj * 13),xcor+(xadj * 10),ycor+(yadj * 6)); // bottom arm
line(xcor+(xadj * 25),ycor+(yadj * 19),xcor+(xadj * 34),ycor+(yadj * 13)); // top leg
line(xcor+(xadj * 25),ycor+(yadj * 19),xcor+(xadj * 25),ycor+(yadj * 29)); // bottem leg
}

void man::clear(void)
{
setcolor(0);
put_image();
setcolor(15);
}

void man::draw(void)
{
clear();
angle += 1;
xcor -= 1+random(2);
ycor += random(3) - 1;
if (xcor < -50) 
	{
	angle = 0;
	xcor = getmaxx() * 10 + random(getmaxx());
	}
put_image();
}

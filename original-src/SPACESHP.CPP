#include <graphics.h>
#include <stdlib.h>
#include "spaceshp.h"

space_ship::space_ship(void)
{
ycor = random(getmaxy() / 2);
xcor = - getmaxx();
}

space_ship::~space_ship()
{
clear();
}

void space_ship::put_image(void)
{
line(xcor,ycor,xcor+12,ycor);
line(xcor+4,ycor-4,xcor+12,ycor);
line(xcor-4,ycor+4,xcor+12,ycor);
line(xcor,ycor+4,xcor+12,ycor);
line(xcor,ycor+2,xcor,ycor+4);
line(xcor+4,ycor-4,xcor-4,ycor+4);
}

void space_ship::clear(void)
{
setcolor(0);
put_image();
setcolor(15);
}

void space_ship::draw(void)
{
clear();
xcor += 3;
ycor += random(4) - 1;
if (xcor > 5 * getmaxx()) 
  {
  xcor = -100;
  ycor = random(getmaxy() / 2);
  }
put_image();
}

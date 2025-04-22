#include <graphics.h>
#include <conio.h>
#include <stdlib.h>
#include <iostream.h>
#include <ctype.h>
#include <string.h>
#include <bios.h>
#include "star.h"
#include "starcl.h"
#include "moon.h"
#include "spaceshp.h"
#include "tic_toc.h"
#include "man.h"
#include "wishworm.h"

void set_screen(void);

int main(int argc,char *argv[])
{
randomize();
long int preticks = biostime(0,0);
int max_star = 500,max_worm = 3;

if (getenv("STAR") != NULL)
	{
	char *env = getenv("STAR");
  strupr(env);
	max_star = atoi(strstr(env,"STAR") + 4);
	if (!max_star)
		max_star = 500;
	max_worm = atoi(strstr(env,"WORM") + 4);
	if (!max_worm)
		max_worm = 3;
	}

for (int count = 0; count < argc; ++count)
	{
	if (stricmp(argv[count],"STAR") == 0)
		max_star = atoi(argv[count+1]);
	if (stricmp(argv[count],"WORM") == 0)
		max_worm = atoi(argv[count+1]);
	}

char inpt,
		 race = FALSE,
		 fire_fly = FALSE,
		 fall = FALSE,
		 cl = TRUE;

stars *star = NULL;
wish_worm *my_worm = NULL;

set_screen();

moon *my_moon = new moon;
space_ship *my_ship = new space_ship;
man *my_man = new man;
tic_toc *my_clock = new tic_toc;

if ((max_worm < 0) || ((unsigned long)sizeof(wish_worm) * max_worm > 0xFF00l))
	max_worm = 3;

if (!(my_worm = new wish_worm[max_worm]))
	{
	max_worm = 3;
	if (!(my_worm = new wish_worm[max_worm]))
		{
		closegraph();
		cout << "Out of memory\n";
		exit(0);
		}
	}

int fast_worm = random(max_worm);

if ((max_star < 0) || ( (unsigned long)sizeof(stars) * max_star > 0xFF00l))
	max_star = 500;

if (!(star = new stars[max_star]))
	 {
	 max_star = 500;
		if (!(star = new stars[500]))
			{
			closegraph();
			cout << "Out of memory\n";
			exit(0);
			}
		}

int counter = 0;
do
	{
	do
		{
		if ((fire_fly == TRUE) && (random(10) == 2))
			race = TRUE;

		for (register int count = 0; count < max_star; ++count)
			{
			star[count].draw();
			if (race == TRUE)
				star[count].race();
			if (fall == TRUE)
				star[count].fall();
			}
		fall = race = FALSE;
		++counter;
		my_moon->draw();
    my_ship->draw();
    my_man->draw();

		for(count = 0; count < max_worm; ++count)
			my_worm[count].draw();
		if (max_worm)
			my_worm[fast_worm].draw();
		
		if (cl == TRUE)
			my_clock->draw();
		}
	while ((!kbhit()) && (counter < 1000));
	if (counter < 1000)
		inpt = toupper(getch());
	else
		inpt = 'q';
	if (inpt == 'F')
		{
		if (fire_fly == FALSE)
			fire_fly = TRUE;
		else
			fire_fly = FALSE;
		}
	if (inpt == ' ')
    fall = TRUE;
	if (inpt == 'R')
    race = TRUE;
	if (inpt == 'C')
		{
		if (cl == TRUE)
			{
			delete my_clock;
			cl = FALSE;
			}
		else
			{
			my_clock = new tic_toc;
			cl = TRUE;
			}
		}
	}
while((inpt != 'Q') && (inpt != 'q'));

delete star;
delete my_moon;
delete my_man;
delete my_worm;
if (cl == TRUE)
		delete my_clock;

closegraph();
cout << "Try this:\n\n";
cout << "star star 20 worm 10\n";
cout << "\n\n By Jason Remillard. with help from Jeff Z. and Tom K.\n";
cout << "Ticks " << (biostime(0,0) - preticks);
return(1);
}

void set_screen(void)
{
/* request auto detection */
int gdriver = DETECT, gmode, errorcode;

errorcode = registerbgidriver(EGAVGA_driver);
errorcode = registerbgidriver(CGA_driver);

/* initialize graphics and local variables */
initgraph(&gdriver, &gmode,"c:\\tc\\bgi");

/* read result of initialization */
errorcode = graphresult();
/* an error occurred */
if (errorcode != grOk)
	{
	cout << "Graphics error:" << grapherrormsg(errorcode);
	cout << "Press any key to halt:";
	getch();
	exit(1);
	}
} // scope out graphics mess

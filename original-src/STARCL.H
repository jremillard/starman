#include "movobj.h"

#ifndef H_starcl
#define H_starcl
class stars
	{
	int xcor,ycor;
	int angle;
	private:
	unsigned char color;
	unsigned int count;
	unsigned int reset;
	char vel;
	char acc;

  protected:
	void clear(void);
	void put_image(void);

  public:
  stars(void);
  ~stars();
  void draw(void);
	void fall(void);
	void race(void);
	void set(int x,int y);
	};

#endif
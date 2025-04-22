#include "basobj.h"
#ifndef H_man
#define H_man

class man : public basic_object
	{
	int angle;
	protected:
	void put_image(void);
	void clear(void);

  public:
  man(void);
  ~man();
	void draw(void);
  };
#endif
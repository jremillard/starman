#include "basobj.h"

#ifndef H_space_ship
#define H_space_ship

class space_ship : public basic_object
	{
	protected:
	void put_image(void);
	void clear(void);

  public:
  space_ship(void);
  ~space_ship();
	void draw(void);
  };

#endif
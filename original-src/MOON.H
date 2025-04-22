#ifndef H_moon
#define H_moon

class moon
	{
	int xcor,ycor;
	int angle;
	protected:
	void put_image(void);
	void clear(void);

  public:
  moon(void);
  ~moon();
	void draw(void);
	};

#endif
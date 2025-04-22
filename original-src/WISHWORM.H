#ifndef H_wish_worm
#define H_wish_worm

class wish_worm 
	{
	float xcor,ycor;
	int step;
	int color;
	int turn;
  protected:
  virtual void put_image(void);
  virtual void clear(void);

  public:
  wish_worm(void);
  ~wish_worm();
  virtual void draw(void);
  };
#endif
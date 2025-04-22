
#ifndef H_tic_toc
#define H_tic_toc

class tic_toc
	{
	int xcor,ycor;
	unsigned char xping;
	unsigned char yping;
	unsigned char hour;
	unsigned char min;
	unsigned char sec;
	int xvel;
	int yvel;
	int refresh;
	float xscale;
	float yscale;
	protected:
	void put_image(void);
	void clear(void);

  public:
	tic_toc(void);
	~tic_toc();
	void draw(void);
	};

#endif
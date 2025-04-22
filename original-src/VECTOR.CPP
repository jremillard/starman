#include <math.h>
#include <stdio.h>
#include <string.h>
#include <conio.h>
#include <stdlib.h>

// Jason Remillard Oct 7,1991
// This is a vector Class with a time domain convolution function
// For Signals and Systems 
// Section 201
// Computer assignment number one

void no_mem(void); // Out of Memory Handler

class time_vector
{
protected:                 // The items here cannot be accessed from 
                           // outside the class.
  double *data;            // The function value (all dynamicly allocated
  double *time;            // The time values
  int length;              // The lenght of the date and time arrays

  time_vector(int len);    // Private Constructer used within class Functions

public:                    // These functions are the only way to access data

  // These are called constructors, They handle the initializing of the class
  // ie They allocate memory, set lenght, and copy in values

  // copy constructor, used whenever a object is returned
  time_vector(const time_vector&);
  // Constructor used to enter data
  time_vector(int length,double *data,double *time);

  // This is the destructor, it is called whenever a object goes out of scope
  // or it is deleted.  It frees up the memory used by the dead object
  ~time_vector();


  // Operators, These are all of the functions that can be proformed on the
  // Object

  double area(void) const; // Finds the area of the object

  // This is called a overloaded operator, It allows me to write A * B and
  // where a and b are of type time_vector and call my * function.
  time_vector operator*(const time_vector&) const;


  // These are my shift operators, They are overloaded like the * operator
  // above.  The >> and << simply call the shift function.
  time_vector operator>>(double time) const;
  time_vector operator<<(double time) const;
  time_vector shift(double time) const;

  // This function folds the vector at the origin
  time_vector fold(void) const;

  // This function returns the value of the function at any time
  double val(double time) const;

  // This the the convolution function
  time_vector conv(const time_vector&) const;

  // File io functions
  // These two functions print the class to the screen for inspection
  void print(void) const;
  friend void print(const time_vector&) const;
  // This function writes the class to a file
  void write_vector(char *filename) const;
};

// Constructers member functions
// Private Constructers

time_vector::time_vector(int len)
// This function allocates some memory and sets the length
{
if (!(data = new double[length]))
  no_mem();
if (!(time = new double[length]))
  no_mem();
length = len;
}

// Public Constructers
time_vector::time_vector(const time_vector &in)
{
// This is the copy constructer (very inportant)
length = in.length;
if (!(data = new double[length]))
  no_mem();
if (!(time = new double[length]))
  no_mem();

memcpy(data,in.data,sizeof(double) * length);
memcpy(time,in.time,sizeof(double) * length);
}

time_vector::time_vector(int len,double *in_data,double *in_time)
{
length = len;

if (!(data = new double[length]))
  no_mem();
if (!(time = new double[length]))
  no_mem();

memcpy(data,in_data,sizeof(double) * len);
memcpy(time,in_time,sizeof(double) * len);
}

// Destructor
time_vector::~time_vector()
{
delete data; // Clear memory off of the heap 
delete time;
}

// io functions
void time_vector::print(void) const
{
// This function clearly prints the object to the screen
printf("\n\n");
for(int count = 0; count < length; ++count)
  {
  printf("indx = %4d Time: %5.2f  Val %5.2f    ",
         count,(float)time[count],(float)data[count]);
  if ((count % 2) == 1) printf("\n");
  }
printf("\n");
}

void print(const time_vector &in) const
{
// this is just a regular old function
in.print();
}

void time_vector::write_vector(char *filename) const
{
// This function writes object to a file so that a standalone graphing 
// program can use it (such as EXCEL, MATLAB, HARVARD GRAPHICS
FILE *outfile = NULL;
if ((outfile = fopen(filename,"wt")) == NULL)
  {
  printf("Cannot open file %s",filename);
  return;
  }

for(int count = 0; count < length; ++count)
	fprintf(outfile,"%5.3f \t %5.3f\n",(float) time[count],(float) data[count]);

fclose(outfile);
}
// Shift operators

time_vector time_vector::operator>>(double time) const
{
time_vector temp = shift(time);
return(temp);
}

time_vector time_vector::operator<<(double time) const
{
time_vector temp = shift(time * -1);
return(temp);
}

time_vector time_vector::shift(double time) const
{
time_vector temp(*this);
for(int count = 0; count < length; ++count)
  temp.time[count] += time;
return(temp);
}

// Lets Fold the array and keep the time in the correct order ie the first
// time value in the array is the oldest time, and the last the most reacent
time_vector time_vector::fold(void) const
{
time_vector temp(*this);
for (int count = 0; count < length; ++count)
  {
  temp.time[count] = -1 * time[length - count -1];
  temp.data[count] = data[length - count -1];
  }
return(temp);
}

// Uses a Hexagonal aproximation for area, This could be improved greatly
double time_vector::area(void) const
{
double area = 0;
for(int count = 0; count < length -1 ; ++count)
  area += fabs(time[count] - time[count+1]) * (data[count]+data[count +1])/2;
return(area);
}

// This allows the compter to ask what the value of the function is from 
// -inf, +inf at any time.  The array is assumed to have a zero value outside
// of the interval.
double time_vector::val(double the_time) const
{
int count;
// bounds
if (the_time < time[0]) 
  return(0);
if (the_time > time[length -1])
  return(0);

for(count = 0; count < length - 1; ++count)
  if ((the_time >= time[count]) && (the_time < time[count+1])) 
    break;

if (time[count] == the_time) 
  return(data[count]);

double slope = (data[count + 1] - data[count]) / (time[count +1] - time[count]);
double  b = data[count] - slope * time[count];
return(slope * the_time + b);
}

// Overloaded * multiply operator
time_vector time_vector::operator*(const time_vector &in) const
{
time_vector temp(*this); // declares temp object and make new 
                         // object equal to this

for(int count = 0; count < length; ++count)
  temp.data[count] = data[count] * in.val(time[count]);
return(temp);
}

// The convolution function
time_vector time_vector::conv(const time_vector &in) const
{
// Lets find where to start and how many points
double inter = time[length - 1] - time[0];
double in_inter = in.time[in.length - 1] - in.time[0];

double step = (inter + in_inter) / (double)(length + in.length);
time_vector temp(length + in.length);
double shift = time[0] + in.time[0];

for(int count = 0; count < (length + in.length) ; ++count)
  {
  temp.time[count] = shift + (count * step);
  // At last, the Convolution !!!
  // Fold it, shift it, multiply it, and then intigrate
  // I used the .shift instead of the <<,>> because .shift is more efffecient
  temp.data[count] = ( ((in.fold()).shift(temp.time[count]) ) * (*this) ).area();
  }
return(temp);
}

main()
{
// The Main Program

// Set up the Step function
double x_data[] = {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};
double x_time[21];
for(int count = 0; count < 21; ++count)
  x_time[count] = -.50 + (count * 0.05);

// Creat object
time_vector x(21,x_data,x_time);
// Write x to a file.
x.write_vector("c:\\matlab\\work\\x.txt");

// Start Convolving Them and writing them to a file.
time_vector a = x.conv(x);
a.write_vector("c:\\matlab\\work\\a.txt");
a.print();

time_vector b = a.conv(x);
b.write_vector("c:\\matlab\\work\\b.txt");
b.print();

time_vector c = b.conv(x);
c.write_vector("c:\\matlab\\work\\c.txt");
c.print();

time_vector d = c.conv(x);
d.write_vector("c:\\matlab\\work\\d.txt");
d.print();

time_vector e = d.conv(x);
e.write_vector("c:\\matlab\\work\\e.txt");
e.print();

time_vector f = e.conv(x);
f.write_vector("c:\\matlab\\work\\f.txt");
f.print();

time_vector g = f.conv(x);
g.write_vector("c:\\matlab\\work\\g.txt");
g.print();

time_vector h = g.conv(x);
h.write_vector("c:\\matlab\\work\\h.txt");
h.print();
// End of program
exit(0);
}

void no_mem(void)
{
// This is the out of memory Message
printf("Out of Memory, Gee don't you wish you had a 32 bit operating system!\n");
exit(-1);
}
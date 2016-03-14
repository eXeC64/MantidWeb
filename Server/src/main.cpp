#include <iostream>

#include "WebSockets.hpp"
#include "MantidHTTP.hpp"

int main()
{
  MantidHTTP mantid;
  mantid.SetAuthToken("changeme");

  try
  {
    mantid.Run();
  }
  catch(std::exception &e)
  {
    std::cout << "Error: " << e.what() << std::endl;
  }

  return 0;
}

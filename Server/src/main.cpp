#include <iostream>

#include "WebSockets.hpp"
#include "MantidHTTP.hpp"

int main()
{
  MantidHTTP mantid;
  mantid.SetAuthToken("changeme");
  mantid.SetDataPath("/home/harry");

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

.PHONY: clean client

MANTID_SRC = /home/harry/Coding/mantid-aur/src/mantid
MANTID_BIN = /home/harry/Coding/mantid-aur/src/build/bin

CXXFLAGS = -W -Wall -std=c++11 \
	-DHAVE_STDINT_H \
	 -I $(MANTID_SRC)/Framework/Algorithms/inc \
	 -I $(MANTID_SRC)/Framework/API/inc \
	 -I $(MANTID_SRC)/Framework/DataObjects/inc \
	 -I $(MANTID_SRC)/Framework/Kernel/inc \
	 -I $(MANTID_SRC)/Framework/Geometry/inc

LDFLAGS = \
	-L $(MANTID_BIN) \
	-lboost_system \
	-lboost_filesystem \
	-lboost_regex \
	-lMantidKernel \
	-lMantidGeometry \
	-lMantidAPI \
	-lMantidDataObjects \
	-lMantidAlgorithms \
	-lMantidMDAlgorithms \
	-lPocoFoundation \
	-lpthread

TARGET = MantidHTTP
BUILDDIR = build

SOURCES = $(wildcard src/*.cpp)
OBJECTS = $(patsubst src/%.cpp,$(BUILDDIR)/%.o,$(SOURCES))

$(TARGET): $(OBJECTS)
	@echo "LINKING $@"
	$(CXX) $(LDFLAGS) -o $@ $^ $(LDLIBS)

$(BUILDDIR)/%.o: src/%.cpp
	@mkdir -p $(BUILDDIR)
	@echo "COMPILING $@"
	$(CXX) -c $(CXXFLAGS) -o $@ $<

clean:
	@$(RM) $(TARGET) $(OBJECTS)

server: $(TARGET)
	LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:/opt/Mantid/lib:/opt/Mantid/plugins" ./$(TARGET)

client:
	@wscat -c localhost:9002

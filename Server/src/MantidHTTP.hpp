#pragma once

#include "MantidWrapper.hpp"
#include "Graph.hpp"

#include "WebSockets.hpp"

#include "json.hpp"
using json = nlohmann::json;

#include <string>
#include <map>

struct MantidClient
{
  MantidClient() : authenticated(false) {};

  bool authenticated;
};

class MantidHTTP
{
public:
  MantidHTTP();

  void Run();
  void SetAuthToken(const std::string& token);
  void SetDataPath(const std::string& path);
  void SetPort(int port);

private:

  void OnOpen(websocketpp::connection_hdl hdl);
  void OnClose(websocketpp::connection_hdl hdl);
  void OnMessage(websocketpp::connection_hdl hdl, WebSocketServer::message_ptr msg);

  void HandleMessage(websocketpp::connection_hdl hdl, const json& js);

  void CheckAuthentication(websocketpp::connection_hdl hdl, const json& js);

  void Send(websocketpp::connection_hdl hdl, const json& js);
  void Broadcast(const json& js);

  // Data directory functionality
  json GetDirectoryContents();

  // Graph functionality
  int CreateGraph();
  bool DeleteGraph(int id);
  json GetGraphList();
  json GetGraphDetails(int id);

  // Callbacks
  void OnWorkspaceAdded(const std::string& name);
  void OnWorkspaceDeleted(const std::string& name);
  void OnWorkspaceReplaced(const std::string& name);
  void OnWorkspaceRenamed(const std::string& oldName, const std::string& newName);
  void OnWorkspacesCleared();
  void OnAlgorithmStarted(int id);
  void OnAlgorithmFinished(int id);
  void OnAlgorithmProgress(int id, double prog, const std::string& msg);
  void OnAlgorithmError(int id, const std::string& error);

  // Websocket server
  WebSocketServer m_server;
  int m_port;

  // Map of connections to client information
  std::map<websocketpp::connection_hdl,
           MantidClient,
           std::owner_less<websocketpp::connection_hdl>
          > m_clients;

  // Authentication token
  std::string m_token;

  // Data directory
  std::string m_dataPath;

  // Mantid wrapper
  MantidWrapper m_mantid;

  // Graphs
  std::map<int, Graph> m_graphs;
};

#include "MantidHTTP.hpp"

using websocketpp::connection_hdl;

MantidHTTP::MantidHTTP()
{
}

void MantidHTTP::Run()
{
  m_mantid.SetWorkspaceAddedHandler(boost::bind(&MantidHTTP::OnWorkspaceAdded, this, _1));
  m_mantid.SetWorkspaceDeletedHandler(boost::bind(&MantidHTTP::OnWorkspaceDeleted, this, _1));
  m_mantid.SetWorkspaceReplacedHandler(boost::bind(&MantidHTTP::OnWorkspaceReplaced, this, _1));
  m_mantid.SetWorkspaceRenamedHandler(boost::bind(&MantidHTTP::OnWorkspaceRenamed, this, _1, _2));
  m_mantid.SetWorkspacesClearedHandler(boost::bind(&MantidHTTP::OnWorkspacesCleared, this));

  m_server.set_open_handler(
    [this](connection_hdl hdl)
    {
      this->OnOpen(hdl);
    }
  );
  m_server.set_close_handler(
    [this](connection_hdl hdl)
    {
      this->OnClose(hdl);
    }
  );
  m_server.set_message_handler(
    [this](connection_hdl hdl, WebSocketServer::message_ptr msg)
    {
      this->OnMessage(hdl,msg);
    }
  );

  m_server.init_asio();
  m_server.listen(3030);
  m_server.start_accept();
  m_server.run();
}

void MantidHTTP::OnOpen(connection_hdl hdl)
{
  (void)hdl;
}

void MantidHTTP::OnClose(connection_hdl hdl)
{
  m_clients.erase(hdl);
}

void MantidHTTP::OnMessage(connection_hdl hdl,
                           WebSocketServer::message_ptr msg)
{
  json js;
  try
  {
    js = json::parse(msg->get_payload());
    std::cout << js.dump(4) << std::endl;
  }
  catch(std::invalid_argument&)
  {
    //Ignore malformed json
    return;
  }

  try
  {
    HandleMessage(hdl, js);
  }
  catch(std::exception& e)
  {
    std::cout << "Caught unhandled exception: " << e.what() << std::endl;
  }
}

void MantidHTTP::SetAuthToken(const std::string& token)
{
  m_token = token;
}

void MantidHTTP::HandleMessage(connection_hdl hdl, const json& js)
{
  if(js["type"] == "AUTH")
  {
    CheckAuthentication(hdl, js);
    return;
  }

  // If we're not authenticated, ignore all other requests
  if(!m_clients[hdl].authenticated)
    return;

  if(js["type"] == "GET_USABLE_ALGORITHMS")
  {
    Send(hdl, {
        {"type", "USABLE_ALGORITHMS"},
        {"data", m_mantid.GetUsableAlgorithms()}
    });
  }
  else if(js["type"] == "GET_ALGORITHM_LIST")
  {
    Send(hdl, {
        {"type", "ALGORITHM_LIST"},
        {"data", m_mantid.GetAlgorithms()}
    });
  }
  else if(js["type"] == "GET_ALGORITHM_DETAILS")
  {
    Send(hdl, {
        {"type", "ALGORITHM_DETAILS"},
        {"data", m_mantid.GetAlgorithmDetails(js["id"])}
    });
  }
  else if(js["type"] == "CREATE_ALGORITHM")
  {
    int id = m_mantid.CreateAlgorithm(js["name"], js["version"]);
    if(id > 0)
    {
      Broadcast({
          {"type", "ALGORITHM_DETAILS"},
          {"data", m_mantid.GetAlgorithmDetails(id)}
      });
    }
    else
    {
      Send(hdl, {{"type", "ERROR"}, {"error", "could not create algorithm"}});
    }
  }
  else if(js["type"] == "DELETE_ALGORITHM")
  {
    if(m_mantid.DeleteAlgorithm(js["id"]))
      Broadcast({
          {"type", "ALGORITHM_DELETED"},
          {"id", js["id"]}
      });
    else
      Send(hdl, {{"type", "ERROR"}, {"error", "error deleting algorithm"}});
  }
  else if(js["type"] == "SET_PROPERTY")
  {
    json data = m_mantid.SetAlgorithmProperty(js["algorithm"], js["property"], js["value"]);
    if(data.is_object())
    {
      Broadcast({
          {"type", "PROPERTY_UPDATED"},
          {"algorithm", js["algorithm"]},
          {"property", js["property"]},
          {"data", data}
      });
    }
    else
      Send(hdl, {{"type", "ERROR"}, {"error", "error setting property"}});
  }
  else if(js["type"] == "RUN_ALGORITHM")
  {
    if(m_mantid.RunAlgorithm(js["id"]))
    {
      Broadcast({
          {"type", "ALGORITHM_RUNNING"},
          {"algorithm", js["id"]}
      });
    }
    else
      Send(hdl, {{"type", "ERROR"}, {"error", "error running algorithm"}});
  }
  else if(js["type"] == "GET_WORKSPACE_LIST")
  {
    Send(hdl, {
        {"type", "WORKSPACE_LIST"},
        {"data", m_mantid.GetWorkspaces()}
    });
  }
  else if(js["type"] == "GET_WORKSPACE_DETAILS")
  {
    Send(hdl, {
        {"type", "WORKSPACE_DETAILS"},
        {"data", m_mantid.GetWorkspaceDetails(js["workspace"])}
    });
  }
  else
  {
    Send(hdl, {{"type","ERROR"}, {"error", "unsupported type"}});
  }
}

void MantidHTTP::CheckAuthentication(connection_hdl hdl, const json& js)
{
  if(js["type"] == "AUTH" && js["token"] == m_token)
  {
    m_clients[hdl].authenticated = true;
    Send(hdl, {{"type", "AUTH"}, {"result", "success"}});
  }
  else
  {
    Send(hdl, {{"type", "AUTH"}, {"result", "failure"}});
    m_server.close(hdl, websocketpp::close::status::policy_violation, "invalid auth token");
  }
}

void MantidHTTP::Send(connection_hdl hdl, const json& js)
{
  m_server.send(hdl, js.dump(), websocketpp::frame::opcode::text);
}

void MantidHTTP::Broadcast(const json& js)
{
  for(auto it = m_clients.begin(); it != m_clients.end(); ++it)
    Send(it->first, js);
}

void MantidHTTP::OnWorkspaceAdded(const std::string& name)
{
  Broadcast({
      {"type", "WORKSPACE_DETAILS"},
      {"data", m_mantid.GetWorkspaceDetails(name)}
  });
}

void MantidHTTP::OnWorkspaceDeleted(const std::string& name)
{
  Broadcast({
      {"type", "WORKSPACE_DELETED"},
      {"name", name}
  });
}

void MantidHTTP::OnWorkspaceReplaced(const std::string& name)
{
  Broadcast({
      {"type", "WORKSPACE_DETAILS"},
      {"data", m_mantid.GetWorkspaceDetails(name)}
  });
}

void MantidHTTP::OnWorkspaceRenamed(const std::string& oldName, const std::string& newName)
{
  Broadcast({
      {"type", "WORKSPACE_RENAMED"},
      {"oldName", oldName},
      {"newName", newName}
  });
}

void MantidHTTP::OnWorkspacesCleared()
{
  Broadcast({
      {"type", "WORKSPACE_LIST"},
      {"data", json::object()}
  });
}


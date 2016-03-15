#pragma once

#include <MantidAPI/Algorithm.h>
#include "CallbackAlgorithmObserver.hpp"

#include "json.hpp"
using json = nlohmann::json;

// This class provides a interface around Mantid's internals, giving workspaces
// and algorithms a wrapper

//Forward declaration required for Poco::NObserver
class MantidWrapper;

class MantidWrapper
{
public:
  MantidWrapper();

  json GetWorkspaces();
  json GetWorkspaceDetails(const std::string& name);

  json GetUsableAlgorithms();

  json GetAlgorithms();
  json GetAlgorithmSummary(int alg);
  json GetAlgorithmDetails(int alg);
  json GetAlgorithmProperties(int alg);
  json SetAlgorithmProperty(int algorithm, const std::string& property, const std::string& value);

  int CreateAlgorithm(const std::string& name, int version);
  bool DeleteAlgorithm(int algorithm);
  bool RunAlgorithm(int algorithm);

  void SetWorkspaceAddedHandler(std::function<void(const std::string&)> cb);
  void SetWorkspaceDeletedHandler(std::function<void(const std::string&)> cb);
  void SetWorkspaceReplacedHandler(std::function<void(const std::string&)> cb);
  void SetWorkspaceRenamedHandler(std::function<void(const std::string&, const std::string&)> cb);
  void SetWorkspacesClearedHandler(std::function<void()> cb);

  void SetAlgorithmStartedHandler(std::function<void(int)> cb);
  void SetAlgorithmFinishedHandler(std::function<void(int)> cb);
  void SetAlgorithmProgressHandler(std::function<void(int, double, const std::string&)> cb);
  void SetAlgorithmErrorHandler(std::function<void(int, const std::string&)> cb);

private:
  std::map<int,Mantid::API::IAlgorithm_sptr> m_algorithms;
  std::map<int,std::unique_ptr<CallbackAlgorithmObserver>> m_algObservers;

  int NewAlgorithmId();

  ///// The following is boilerplate to deal with event callbacks/handlers

  //Workspaces
  void DeleteEvent(Mantid::API::WorkspacePreDeleteNotification_ptr pNf);
  void AddEvent(Mantid::API::WorkspaceAddNotification_ptr pNf);
  void ReplaceEvent(Mantid::API::WorkspaceAfterReplaceNotification_ptr pNf);
  void RenameEvent(Mantid::API::WorkspaceRenameNotification_ptr pNf);
  void ClearEvent(Mantid::API::ClearADSNotification_ptr);

  //Algorithms
  void StartEvent(int alg);
  void StopEvent(int alg);
  void ProgressEvent(int alg, double prog, const std::string& msg);
  void ErrorEvent(int alg, const std::string& error);

  Poco::NObserver<MantidWrapper, Mantid::API::WorkspacePreDeleteNotification> m_deleteObserver;
  Poco::NObserver<MantidWrapper, Mantid::API::WorkspaceAddNotification> m_addObserver;
  Poco::NObserver<MantidWrapper, Mantid::API::WorkspaceAfterReplaceNotification> m_replaceObserver;
  Poco::NObserver<MantidWrapper, Mantid::API::WorkspaceRenameNotification> m_renameObserver;
  Poco::NObserver<MantidWrapper, Mantid::API::ClearADSNotification> m_clearObserver;

  //Workspaces
  std::function<void(const std::string&)> m_addHandler;
  std::function<void(const std::string&)> m_deleteHandler;
  std::function<void(const std::string&)> m_replaceHandler;
  std::function<void(const std::string&, const std::string&)> m_renameHandler;
  std::function<void()> m_clearHandler;

  //Algorithms
  std::function<void(int)> m_startHandler;
  std::function<void(int)> m_stopHandler;
  std::function<void(int, double, const std::string&)> m_progressHandler;
  std::function<void(int, const std::string&)> m_errorHandler;
};
